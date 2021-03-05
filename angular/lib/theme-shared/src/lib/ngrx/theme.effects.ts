import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, Injectable, Injector, NgZone, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, shareReplay, skip, tap } from 'rxjs/operators';
import { merge, noop } from 'rxjs';
import { setLayoutSize } from './theme.actions';
import { select, Store } from '@ngrx/store';
import {
  differentLocales,
  registerLocale,
  LocaleValue,
  selectAppReady,
  selectCurrentCulture,
} from '@abpdz/ng.core';
import { AppSplashScreenService } from '../services/splash-screen.service';
import { Directionality, DIR_DOCUMENT } from '@angular/cdk/bidi';
import { DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ThemeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private injector: Injector,
    private _adapter: DateAdapter<any>,
    private dir: Directionality,
    private breakpointObserver: BreakpointObserver
  ) {}

  language$ = createEffect(
    () =>
      this.store.pipe(
        select(selectCurrentCulture),
        map((k) => {
          if (k) {
            const dir = this.dir;
            if (k.isRightToLeft) {
              document.getElementsByTagName('html')[0].dir = 'rtl';
              (dir as any).value = 'rtl';
              dir.change.emit('rtl');
            } else {
              document.getElementsByTagName('html')[0].dir = 'ltr';
              (dir as any).value = 'ltr';
              dir.change.emit('ltr');
            }
            const l =
              differentLocales[k.cultureName] || k.cultureName || 'en-US';
            this._adapter.setLocale(l);
          }
        })
      ),
    { dispatch: false }
  );
  readyEffect$ = createEffect(
    () =>
      this.store.select(selectAppReady).pipe(
        skip(1),
        tap((r) => {
          const e = this.injector.get(AppSplashScreenService);
          if (r) {
            e.hide();
          } else {
            e.show();
          }
        })
      ),
    {
      dispatch: false,
    }
  );
  breakpointObserver$ = createEffect(
    () =>
      merge(
        this.breakpointObserver.observe([
          Breakpoints.Small,
          Breakpoints.Large,
          Breakpoints.Medium,
          Breakpoints.XLarge,
          Breakpoints.XSmall,
        ])
      ).pipe(
        shareReplay(),

        map((a) =>
          setLayoutSize({
            payloadType: {
              Small: a.breakpoints[Breakpoints.Small],
              Large: a.breakpoints[Breakpoints.Large],
              Medium: a.breakpoints[Breakpoints.Medium],
              XLarge: a.breakpoints[Breakpoints.XLarge],
              XSmall: a.breakpoints[Breakpoints.XSmall],
            },
          })
        )
      ) as any
  );
}
