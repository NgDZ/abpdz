import { selectAppReady } from '@abpdz/ng.core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-material-application-layout',
  templateUrl: './material-application-layout.component.html',
  styleUrls: ['./material-application-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialApplicationLayoutComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  ready$: Observable<boolean>;

  // Private

  constructor(private breakpointObserver: BreakpointObserver, store: Store) {
    this.ready$ = store.select(selectAppReady);
  }

  ngOnInit(): void {}
}
