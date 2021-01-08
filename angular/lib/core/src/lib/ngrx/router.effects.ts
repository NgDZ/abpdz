import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { tap, filter, map, mergeMap } from 'rxjs/operators';

import { createEffect } from '@ngrx/effects';
import { LocalizationService } from '../services';

@Injectable()
export class RouterEffects {
  updateTitle$ = createEffect(
    () =>
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
        map(
          (data) =>
            `${this.transalte.instant('APP_NAME')} - ${this.transalte.instant(
              data['title']
            )}`
        ),
        tap((title) => this.titleService.setTitle(title))
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private router: Router,
    private titleService: Title,
    private transalte: LocalizationService,

    private activatedRoute: ActivatedRoute
  ) {}
}
