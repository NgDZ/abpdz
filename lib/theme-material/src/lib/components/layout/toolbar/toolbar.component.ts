import {
  ApplicationConfiguration,
  AuthService,
  SessionStateService,
} from '@abpdz/ng.core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mtheme-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  @Output()
  toggleNav = new EventEmitter<boolean>();

  @Output()
  toggleQuickPannel = new EventEmitter<boolean>();

  dropdownLanguages$: Observable<ApplicationConfiguration.Language[]>;

  constructor(
    public session: SessionStateService,
    public authService: AuthService
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

  ngOnInit(): void {}

  onChangeLang(cultureName: string) {
    this.session.setLanguage(cultureName);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {});
  }
}
