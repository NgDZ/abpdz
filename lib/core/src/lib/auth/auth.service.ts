import { Inject, Injectable, Injector } from '@angular/core';
import {
  BehaviorSubject,
  from,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
  timer,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { RestOccurError } from '../ngrx/abp.actions';
import { ABP, ApplicationConfiguration, Config } from '../models';
import { selectCurrentUser } from '../ngrx/abp.reducer';
import {
  filter,
  map,
  switchMap,
  tap,
  catchError,
  switchMapTo,
  take,
  debounceTime,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CORE_OPTIONS } from '../tokens';
import { Router, RouterState } from '@angular/router';
import { newUserToken } from './ngrx';
import { AuthTokenModel } from './tokens';
import { OnDestroy } from '@angular/core';
import { SubSink } from '../utils';

// idle workflow
// after idle time this tab set "idel-tab-check"=true to local storage
// if any other tab is active and listeing to localstore event it will sended "false" to the store
// if no tab replace the app will disocnnec from all tabs
export interface Authenticate {
  username: string;
  password: string;
  rememberMe?: boolean;
  redirectUrl?: string;
}
export interface RefreshGrantModel {
  refresh_token: string;
  refresh_count?: number;
}

// tslint:disable: typedef
export const tokenStoreKey = 'auth-tokens';

export const idelTabCheckStoreKey = 'idel-tab-check';
export function getJwtToken(): string {
  return JSON.parse(localStorage.getItem(tokenStoreKey) || '{}').access_token;
}
export function getJwt(): AuthTokenModel {
  return JSON.parse(localStorage.getItem(tokenStoreKey) || '{}');
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  subs = new SubSink();
  env: Config.Environment;

  active = false;
  idelTabCheck$ = new Subject<boolean>();

  get redirectUrl(): string {
    return this.router.routerState.snapshot.root.queryParams['redirectUrl'];
  }
  isInternalAuth = true;

  tick$ = new Subject<any>();
  token$: BehaviorSubject<AuthTokenModel>;
  currentUser$: Observable<Partial<ApplicationConfiguration.CurrentUser>>;
  setActive(active) {
    if (this.active === active) {
      return;
    }
    this.active = active;
    if (active) {
    } else {
      localStorage.setItem(idelTabCheckStoreKey, 'true');
      localStorage.removeItem(idelTabCheckStoreKey);
    }
  }

  private catchError = (data) => this.store.dispatch(RestOccurError({ data }));
  constructor(
    private injector: Injector,
    private store: Store,
    private router: Router,
    private http: HttpClient
  ) {
    this.setActive(true);
    localStorage.removeItem(idelTabCheckStoreKey);
    window.addEventListener('beforeunload', (event) => {
      // this.setActive(false);
      if (this.active) {
        localStorage.setItem(
          'lastActiveTabClosedTime',
          new Date().getTime() + ''
        );
      }
    });
    window.addEventListener('storage', (event) => {
      if (event.storageArea !== localStorage) {
        return;
      }
      if (event.key === tokenStoreKey) {
        if (event.newValue == null) {
          this.logout();
        } else {
          const token = JSON.parse(event.newValue || '{}');
          if (token.refresh_count == null || token.refresh_count === 0) {
            this.store.dispatch(newUserToken({ token }));
          }
          this.setupAutomaticSilentRefresh(token);
        }
        // Do something with event.newValue
      }
      if (event.key === idelTabCheckStoreKey) {
        // idle pulse check
        if (this.active && event.newValue === 'true') {
          localStorage.setItem(idelTabCheckStoreKey, 'false');
        } else if (event.newValue === 'false') {
          this.idelTabCheck$.next(true);
          localStorage.removeItem(idelTabCheckStoreKey);
        }
      }
      if (event.key === 'lastActiveTabClosedTime') {
        if (!this.active) {
          console.log('active tab is closed and i am inactive');
          this.tick$.next(null);
        }
      }
    });

    this.currentUser$ = this.store.select(selectCurrentUser).pipe(
      filter((k) => k != null),
      map((k) => {
        if (!this.hasValidAccessToken()) {
          return { isAuthenticated: false };
        }
        return k;
      })
    );
    this.token$ = new BehaviorSubject<AuthTokenModel>(null);
  }
  registerForTokens() {
    // register for refreshing token
    this.subs.add(
      this.token$
        .pipe(
          switchMap((token) => {
            if (token == null || token.expiration_date == null) {
              return of(null);
            }
            const expireIn = Math.max(
              token.expiration_date -
                (new Date().getTime() -
                  Math.round((Math.random() * 100000) % 10000)),
              1000
            );
            console.log('token expire in :' + expireIn + ' ms');
            return timer(expireIn % 864000000);
          }),
          switchMap((e) =>
            this.getToken().refresh_token ? this.refreshToken() : of(true)
          )
        )
        .subscribe((token) => {
          // this.setupAutomaticSilentRefresh(token);
        })
    );

    // register for idle logic
    this.subs.add(
      merge(
        fromEvent(document, 'click'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'mousemove'),
        this.tick$
      )
        .pipe(
          tap((k) => this.setActive(true)),
          // switchMapTo(timer(this.idleTime)),
          // 
          debounceTime(this.env.idleTime || 10 * 60 * 1000),
          map(() => {})
        )
        .pipe(
          tap((k) => this.setActive(false)),
          switchMap((k) => this.checkIfOtherTabIsActive())
        )
        .subscribe((active) => {
          if (!active && this.hasValidAccessToken()) {
            this.logout();
          }
        })
    );
  }
  private checkIfOtherTabIsActive(): Observable<boolean> {
    return merge(this.idelTabCheck$, timer(2000).pipe(map((e) => false))).pipe(
      take(1)
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  private encodeObjectToParams(obj: any): string {
    return Object.keys(obj)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
      )
      .join('&');
  }
  public getNewToken(
    data: Authenticate | RefreshGrantModel,
    grantType = 'password'
  ): Observable<AuthTokenModel> {
    const AuthData: any = Object.assign({}, data, {
      grant_type: grantType,
      client_id: this.env.oAuthConfig.clientId,
      client_secret: this.env.oAuthConfig.clientSecret,
      // offline_access is required for a refresh token
      scope: this.env.oAuthConfig.scope,
    });
    return this.http
      .post<AuthTokenModel>(
        this.env.oAuthConfig.tokenUrl,
        this.encodeObjectToParams(AuthData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .pipe(
        // map(res => res.json()),
        map((tokens) => {
          const now = new Date();
          tokens.expiration_date =
            now.getTime() +
            Math.ceil(
              ((tokens.expires_in ? tokens.expires_in * 1000 : 0) * 4) / 5
            );
          tokens.refresh_count = AuthData.username ? 0 : 1;
          this.setToken(tokens);
          if (AuthData.username) {
            this.store.dispatch(newUserToken({ token: tokens }));
          }
          this.setupAutomaticSilentRefresh(tokens);
          return tokens;
        })
      );
  }

  loadToken(): any {
    return {};
  }
  hasValidAccessToken() {
    const expiration_date = this.getToken().expiration_date || 0;
    const now = new Date().getTime();
    return expiration_date > now;
  }

  refreshToken(): Observable<AuthTokenModel> {
    const token = this.getToken();
    token.refresh_count = (token.refresh_count || 0) + 1;

    return this.getNewToken(
      {
        refresh_token: token.refresh_token,
        refresh_count: token.refresh_count,
      },
      'refresh_token'
    );
  }

  expired(t): boolean {
    return true;
  }
  getAccessToken(): any {
    return this.getToken().access_token;
  }

  getToken(): AuthTokenModel {
    return JSON.parse(
      localStorage.getItem(tokenStoreKey) || '{}'
    ) as AuthTokenModel;
  }

  setToken(token?: AuthTokenModel) {
    if (token == null) {
      localStorage.removeItem(tokenStoreKey);
    } else {
      localStorage.setItem(tokenStoreKey, JSON.stringify(token));
    }
  }
  getRefreshToken() {
    return this.getToken().refresh_token;
  }

  init(env: Config.Environment): Observable<any> {
    this.env = env;

    const shouldClear = shouldStorageClear(
      env.oAuthConfig.clientId,
      localStorage
    );
    if (shouldClear) {
      clearlocalStorage(localStorage);
    }

    return of(true).pipe(
      switchMap((k) => {
        if (this.hasValidAccessToken() || !this.getRefreshToken()) {
          return of(null);
        }
        return this.refreshToken();
      }),
      tap((k) => {
        this.registerForTokens();
      })
      // catchError(this.catchError)
    );
  }
  setupAutomaticSilentRefresh(token?: AuthTokenModel, arg1?: string): void {
    this.token$.next(token);
  }

  initLogin(url?) {
    return this.login(url);
  }

  login(url?) {
    // this.initCodeFlow(null, {
    //   returnUrl: '/homebcl_url',
    // });

    const router = this.injector.get(Router);

    const redirectUrl = url || this.redirectUrl || router.url || '/';
    router.navigate([this.env.oAuthConfig.loginUrl], {
      queryParams: { redirectUrl },
    });
    return of(true);
  }
  redirectAuthChanged() {
    if (this.redirectUrl) {
      const router = this.injector.get(Router);
      const url = this.redirectUrl;
      router.navigate([url]);
    }
  }
  checkIfInternalAuth() {
    // this.initCodeFlow();

    return true;
  }

  logout(url?) {
    // this.logOut();
    // todo : call the server to revoke current access token

    clearlocalStorage(localStorage);

    this.login(url);
    this.store.dispatch(newUserToken({ token: {} as any }));
    return of(true);
  }
}
export function clearlocalStorage(storage: { removeItem: (k) => any }) {
  const keys = [
    idelTabCheckStoreKey,
    tokenStoreKey,
    'access_token',
    'id_token',
    'refresh_token',
    'nonce',
    'PKCE_verifier',
    'expires_at',
    'id_token_claims_obj',
    'id_token_expires_at',
    'id_token_stored_at',
    'access_token_stored_at',
    'granted_scopes',
    'session_state',
    'abpOAuthClientId',
    'FUSE_CONFIG',
    'FUSE2.shortcuts',
    'abpSession',
  ];

  keys.forEach((key) => storage.removeItem(key));
}

function shouldStorageClear(
  clientId: string,
  storage: { setItem: (k, v?) => any; getItem: (k) => any }
): boolean {
  const key = 'abpOAuthClientId';
  if (!storage.getItem(key)) {
    storage.setItem(key, clientId);
    return false;
  }

  const shouldClear = storage.getItem(key) !== clientId;
  if (shouldClear) {
    storage.setItem(key, clientId);
  }
  return shouldClear;
}
