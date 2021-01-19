import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { ApplicationConfiguration } from '../models/application-configuration';
import { Session } from '../models/session';
import { isEqual } from 'lodash-es';
import {
  selectCurrentCulture,
  selectCurrentLanguage,
  selectCurrentTenant,
  selectLanguages,
  startLoadingAbpApplicationData,
} from '../ngrx';
import { SubSink } from '../utils';
import { ConfigStateService } from './config-state.service';
import { combineLatest, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStateService implements OnDestroy {
  session: Session.State = {} as any;
  signalr:string;

  subs: SubSink;
  selectedCulture$: Observable<ApplicationConfiguration.CurrentCulture>;
  languages$: Observable<ApplicationConfiguration.Language[]>;
  tenant$: Observable<ApplicationConfiguration.CurrentTenant>;

  language$: Observable<string>;
  private updateLocalStorage = () => {
    localStorage.setItem('abpSession', JSON.stringify(this.session));
  };
  constructor(private ngxStore: Store) {
    this.subs = new SubSink();
    this.init();
    // this.setInitialLanguage();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  patchSession(p, saveToLocalStorage = true) {
    this.session.language = p?.language ?? this.session.language;
    this.session.tenant = p?.tenant ?? this.session.tenant;
    if (saveToLocalStorage) {
      localStorage.setItem('abpSession', JSON.stringify(this.session));
    }
  }
  private init() {
    const session = localStorage.getItem('abpSession');
    if (session) {
      try {
        this.patchSession(JSON.parse(session), false);
      } catch (error) {}
    }
    this.languages$ = this.ngxStore
      .select(selectLanguages)
      .pipe(map((k) => k ?? []));
    this.selectedCulture$ = this.ngxStore
      .select(selectCurrentCulture)
      .pipe(filter((k) => k != null));
    this.language$ = this.ngxStore
      .select(selectCurrentLanguage)
      .pipe(filter((k) => k != null));
    this.tenant$ = this.ngxStore
      .select(selectCurrentTenant)
      .pipe(filter((k) => k != null));

    this.subs.push(
      this.getLanguage$().subscribe((k) => this.setLanguage(k, false))
    );
    this.subs.push(this.getTenant$().subscribe((k) => this.setTenant(k)));
  }

  onLanguageChange$() {
    return this.getLanguage$();
  }

  onTenantChange$() {
    return this.getTenant$();
  }

  getLanguage() {
    return this.session?.language;
  }

  getLanguage$() {
    return this.language$;
  }

  getTenant() {
    return this.session?.tenant;
  }

  getTenant$() {
    return this.tenant$;
  }

  setTenant(tenant: ApplicationConfiguration.CurrentTenant) {
    if (isEqual(tenant, this.session.tenant)) {
      return;
    }

    this.patchSession({ tenant });
  }

  setLanguage(language: string, reloadAbp = true) {
    if (language === this.session.language) {
      return;
    }
    this.patchSession({ language });
    document.documentElement.setAttribute('lang', language);
    this.deleteCookie('.AspNetCore.Culture=');
    if (reloadAbp) {
      this.getLanguage$()
        .pipe(take(1))
        .subscribe((k) => {
          if (language != k) {
            this.ngxStore.dispatch(startLoadingAbpApplicationData());
          }
        });
    }
  }

  private getCookie(name: string) {
    const ca: Array<string> = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  private setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ''
  ) {
    const d: Date = new Date();
    d.setTime(d.getTime() + (expireDays ?? 356) * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  // private consent(isConsent: boolean, e: any) {
  //   if (!isConsent) {
  //     return this.isConsented;
  //   } else if (isConsent) {
  //     this.setCookie(COOKIE_CONSENT, '1', COOKIE_CONSENT_EXPIRE_DAYS);
  //     this.isConsented = true;
  //     e.preventDefault();
  //   }
  // }
}
