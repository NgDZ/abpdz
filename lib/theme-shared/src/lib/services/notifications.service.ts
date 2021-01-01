import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent, from, of } from 'rxjs';
import {
  shareReplay,
  switchMap,
  tap,
  debounceTime,
  retry,
} from 'rxjs/operators';

// import { getJwtToken } from '@app-core/auth/models';
// import { AuthFacade } from '@app-core/auth/ngrx';
import { HttpClient } from '@angular/common/http';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

import { ApplicationConfiguration } from '@abpdz/ng.core';
// todo implement notification api based on the new template
export interface ClientNotificationType {
  src: string;
  type: string;
  date?: Date;
  data: any;
  connectionId?: string;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notification$ = new Observable<ClientNotificationType>();
  public _notification$ = new Subject<ClientNotificationType>();

  currentUser$: Observable<ApplicationConfiguration.CurrentUser>;

  connection: HubConnection;
  pendingGoups: string[] = [];
  constructor(public appConfig, public http: HttpClient) {
    try {
      this.signalRCore();
    } catch (error) {}
  }
  signalRId() {
    return this.connection?.connectionId;
  }
  private signalRCore() {
    this.notification$ = this.currentUser$.pipe(
      // debounceTime(150),
      tap((k) => {
        if (this.appConfig.useSignalRCore) {
          if (this.connection) {
            this.connection.stop();
          }
          this.connection = new HubConnectionBuilder()
            .withUrl(this.appConfig.signalrUrl, {
              // accessTokenFactory: getJwtToken
            })
            .build();
          const self = this;
          this.connection
            .start()
            .then((e) => {
              if (k) {
                this.http
                  .get(this.appConfig.signalRegisterForUser)
                  .pipe(retry(20))
                  .subscribe();
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
              data: any,
              date: Date,
              connectionId,
              userId
            ) => {
              self._notification$.next({
                src,
                type,
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
}
