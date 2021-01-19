import { Inject, Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { tap, filter, map, mergeMap } from 'rxjs/operators';

import { createEffect } from '@ngrx/effects';
import { LocalizationService } from '../services';
import { ABP } from '../models/common';
import { CORE_OPTIONS } from '../tokens/options.token';

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
            `${this.transalte.instant(
              this.options.environment?.application.abrivation
            )} - ${this.transalte.instant(data['title'])}`
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

    @Inject(CORE_OPTIONS) private options: ABP.Root,
    private transalte: LocalizationService,

    private activatedRoute: ActivatedRoute
  ) {}
}
