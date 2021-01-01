import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { createEffect, Actions, ofType, rootEffectsInit } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  tap,
  map,
  switchMap,
  exhaustMap,
  catchError,
  delay,
} from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { newUserToken } from '../auth/ngrx';
import {
  setAbpApplicationData,
  setEnvirement,
  startLoadingAbpApplicationData,
} from './abp.actions';
import { CORE_OPTIONS } from '../tokens';
import { select, Store } from '@ngrx/store';
import { selectCurrentCulture, selectCurrentLanguage } from './abp.reducer';
import { ApplicationConfigurationService } from '../services/application-configuration.service';
@Injectable({
  providedIn: 'root',
})
export class AbpEffects {
  constructor(
    private actions$: Actions,
    private injector: Injector,
    private auth: AuthService,

    private appConfig: ApplicationConfigurationService,
    private store: Store
  ) {}

  loadOldSessionToken$ = createEffect((() =>
    this.actions$.pipe(
      ofType(setEnvirement),
      switchMap((k) => this.auth.init(k.data)),
      map((a) => newUserToken(null)),
      catchError((k) => of(newUserToken(null)))
    )) as any);
  loadEnvirement$ = createEffect((() =>
    this.actions$.pipe(
      ofType(rootEffectsInit),
      map((a) => {
        const options = this.injector.get(CORE_OPTIONS);
        return setEnvirement({ data: options.environment as any });
      })
    )) as any);

  newUserToekn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newUserToken),
      map((k) => startLoadingAbpApplicationData())
    )
  );
  loadApplicationDataEffect$ = createEffect((() =>
    this.actions$.pipe(
      ofType(startLoadingAbpApplicationData),
      switchMap((k) => this.appConfig.getConfiguration()),
      map((k) => setAbpApplicationData({ data: k })),
      catchError((k) =>
        of(setAbpApplicationData({ data: { currentUser: 'mb' } as any }))
      )
    )) as any);
  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setAbpApplicationData),

        tap((title) => {
          this.auth.redirectAuthChanged();
        })
      ),
    {
      dispatch: false,
    }
  );
}
