import { selectAppReady, SubSink } from '@abpdz/ng.core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-material-application-layout',
  templateUrl: './material-application-layout.component.html',
  styleUrls: ['./material-application-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialApplicationLayoutComponent implements OnInit, OnDestroy {
  opendDrawer = false;
  subs = new SubSink();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map((result) => result.matches));
  ready$: Observable<boolean>;

  // Private

  constructor(
    private breakpointObserver: BreakpointObserver,
    store: Store,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.ready$ = store.select(selectAppReady);

    this.subs.push(
      this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          switchMap((k) => this.isHandset$.pipe(take(1)))
          // filter((m) => m)
        )
        .subscribe((e) => {
          if (e) {
            this.opendDrawer = false;
            this.cd.markForCheck();
          }
        })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {}
}
