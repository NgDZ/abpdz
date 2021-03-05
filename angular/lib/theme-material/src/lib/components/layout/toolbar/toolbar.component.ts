import {
  ApplicationConfiguration,
  AuthService,
  RoutesService,
  SessionStateService,
  SubSink,
} from '@abpdz/ng.core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'mtheme-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Output()
  toggleNav = new EventEmitter<boolean>();

  @Output()
  toggleQuickPannel = new EventEmitter<boolean>();

  dropdownLanguages$: Observable<ApplicationConfiguration.Language[]>;
  subs = new SubSink();

  constructor(
    public session: SessionStateService,
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,

    public router: Router,
    public readonly routes: RoutesService
  ) {
    this.dropdownLanguages$ = combineLatest([
      this.session.languages$,
      this.session.selectedCulture$,
    ]).pipe(
      map(([languages, selectedLangCulture]) =>
        languages?.filter(
          (lang) => lang?.cultureName !== selectedLangCulture?.cultureName
        )
      )
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {}

  onChangeLang(cultureName: string) {
    this.session.setLanguage(cultureName);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {});
  }
}
