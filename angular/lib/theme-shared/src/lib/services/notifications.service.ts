import { Inject, Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  fromEvent,
  from,
  of,
  BehaviorSubject,
} from 'rxjs';
import {
  shareReplay,
  switchMap,
  tap,
  debounceTime,
  retry,
  map,
  distinctUntilChanged,
} from 'rxjs/operators';

// import { getJwtToken } from '@app-core/auth/models';
// import { AuthFacade } from '@app-core/auth/ngrx';
import { HttpClient } from '@angular/common/http';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

import {
  ABP,
  AbpDzNotificationInfo,
  ApplicationConfiguration,
  AuthService,
  CORE_OPTIONS,
  CrudOperation,
  EventFilterDto,
  SessionStateService,
} from '@abpdz/ng.core';
import { CleanObjectProperties } from '../models';
// todo implement notification api based on the new template
export interface ClientNotificationType {
  src: string;
  type: string;
  id: string;
  action: any;

  date?: Date;
  data: any;
  connectionId?: string;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notification$: Observable<ClientNotificationType>;
  public abpdzNotification$ = new BehaviorSubject<AbpDzNotificationInfo[]>([]);
  private _notification$: Subject<ClientNotificationType>;

  private connection: HubConnection;
  private pendingGoups: string[] = [];
  constructor(
    @Inject(CORE_OPTIONS) private options: ABP.Root,

    private abp: SessionStateService,
    public http: HttpClient,
    private auth: AuthService
  ) {
    this._notification$ = new Subject<ClientNotificationType>();
    // {
    //   params: CleanObjectProperties(param1),
    // }
    try {
      this.signalRCore();
    } catch (error) {}
  }
  signalRId() {
    return this.connection?.connectionId;
  }
  dismiss(ids: string[]) {
    return this.http.post('/api/abpdz-notification/Dismiss', ids);
  }
  private signalRCore() {
    this.auth.currentUser$.subscribe((k) => {
      console.log(k);
    });
    this.notification$ = this.auth.currentUser$.pipe(
      // debounceTime(150),
      map((k) => k.id),
      distinctUntilChanged(),
      tap((k) => {
        if (this.options?.environment?.notifications?.useSignalr) {
          this.abp.signalr = null;

          if (this.connection) {
            this.connection.stop();
          }
          this.connection = new HubConnectionBuilder()
            .withUrl(
              this.options.environment.notifications.signalrUrl ||
                '/abpdz-notification-hub',
              {
                // accessTokenFactory: getJwtToken
              }
            )
            .build();
          const self = this;
          this.connection
            .start()
            .then((e) => {
              if (k) {
                this.abp.signalr = this.signalRId();
                var query: EventFilterDto = {
                  checked: true,
                  userId: k,
                  skipCount: 0,
                  maxResultCount: 20,
                };
                this.http
                  .get(
                    this.options.environment.notifications.notificationUrl ||
                      '/api/abpdz-notification/getAll',
                    {
                      params: CleanObjectProperties(query),
                    }
                  )
                  .pipe(retry(20))
                  .subscribe((notResult: any) => {
                    this.abpdzNotification$.next(notResult.items);
                  });
                if (this.pendingGoups.length > 0) {
                  this.AddToGroup(this.pendingGoups)
                    .pipe(retry(20))
                    .subscribe();
                }
              }
            })
            .catch((err) => document.write(err));
          this.connection.on(
            'notify',
            (
              src: string,
              type: string,
              action: string,
              id: string,
              data: any,
              date: Date,
              connectionId,
              userId
            ) => {
              self.dispatchNotification({
                src,
                type,
                action,
                id,
                data,
                date,
                connectionId,
                userId,
              });
            }
          );
        }
      }),
      shareReplay(),
      switchMap((k) => this._notification$)
    );
  }
  AddToGroup(groups: string[]) {
    if (groups.length > 0 && groups !== this.pendingGoups) {
      groups.forEach((element) => {
        if (this.pendingGoups.indexOf(element) < 0) {
          this.pendingGoups.push(element);
        }
      });
    }
    if (
      this.connection &&
      this.connection.state === HubConnectionState.Connected
    ) {
      return from(this.connection.send('AddToGroup', groups));
    }
    return of(null);
  }
  RemoveFromGroup(groups: string[]) {
    if (this.pendingGoups.length > 0 && groups.length > 0) {
      groups.forEach((element) => {
        const i = this.pendingGoups.indexOf(element);
        if (i >= 0) {
          this.pendingGoups.splice(i, 1);
        }
      });
    }
    if (
      this.connection &&
      this.connection.state === HubConnectionState.Connected
    ) {
      return from(this.connection.send('RemoveFromGroup', groups));
    }
    return of(null);
  }
  dispatchNotification(item: ClientNotificationType) {
    console.log(item);
    if (item.type == 'AbpDzNotificationInfo') {
      if (item.action == CrudOperation.Create) {
        this.abpdzNotification$.next([
          item.data,
          ...this.abpdzNotification$.value,
        ]);
      } else if (item.action == CrudOperation.Update) {
        const not = this.abpdzNotification$.value.find((k) => k.id == item.id);
        if (not != null) {
          Object.assign(not, item.data);
        }
        this.abpdzNotification$.next(this.abpdzNotification$.value);
      } else if (item.action == CrudOperation.Delete) {
        const not = this.abpdzNotification$.value.findIndex(
          (k) => k.id == item.id
        );
        if (not >= 0) {
          this.abpdzNotification$.value.splice(not, 1);
        }
        this.abpdzNotification$.next(this.abpdzNotification$.value);
      }
    }
    this._notification$.next(item);
  }
}
