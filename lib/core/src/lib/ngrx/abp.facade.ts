import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConfiguration } from '../models/application-configuration';
import {
  AbpState,
  selectAbpFeatureKey,
  selectAppConfig,
  selectCurrentLanguage,
} from './abp.reducer';

@Injectable({
  providedIn: 'root',
})
export class AbpFacade implements OnDestroy {
  subs: Subscription[] = [];
  abp: AbpState;

  constructor(private store: Store) {
    this.subs.push(
      this.store.pipe(select(selectAbpFeatureKey)).subscribe((k) => (this.abp = k))
    );
    // export const selectUser = createSelector(selectAuthStatusState, getUser);
  }
  ngOnDestroy(): void {
    this.subs.forEach((s) => {
      s.unsubscribe();
    });
  }
  getLanguage(): string {
    return this.abp?.conf?.localization?.currentCulture?.cultureName;
  }
  getLanguage$(): Observable<string> {
    return this.store.pipe(select(selectCurrentLanguage));
  }
  getTenant(): ApplicationConfiguration.CurrentTenant {
    return this.abp?.conf?.currentTenant;
  }
  // permission$(permission) {
  //   return this.config$.pipe(
  //     map((k) => k.auth?.grantedPolicies[permission] === true)
  //   );
  // }
}
