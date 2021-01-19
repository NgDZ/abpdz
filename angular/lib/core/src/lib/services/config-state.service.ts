import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConfiguration } from '../models/application-configuration';
import {
  selectAbpFeatureKey,
  selectAppConfig,
  setAbpApplicationData,
} from '../ngrx';
import { SubSink } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ConfigStateService implements OnDestroy {
  subs: SubSink;
  abp$: Observable<ApplicationConfiguration.Response>;
  abp: ApplicationConfiguration.Response;
  constructor(private ngs: Store) {
    this.subs = new SubSink();
    this.abp$ = this.ngs.select(selectAppConfig);
    this.subs.add(this.abp$.subscribe((k) => (this.abp = k)));
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  get createOnUpdateStream() {
    return this.abp$;
  }

  setState = (state: ApplicationConfiguration.Response) => {
    this.ngs.dispatch(setAbpApplicationData({ data: state }));
  };

  getOne$(key: string) {
    return this.abp$.pipe(map((state) => state[key]));
  }

  getOne(key: string) {
    return this.abp[key];
  }

  getAll$(): Observable<ApplicationConfiguration.Response> {
    return this.abp$;
  }

  getAll(): ApplicationConfiguration.Response {
    return this.abp;
  }

  getDeep$(keys: string[] | string) {
    keys = splitKeys(keys);

    return this.abp$.pipe(
      map((state) => {
        return (keys as string[]).reduce((acc, val) => {
          if (acc) {
            return acc[val];
          }

          return undefined;
        }, state);
      })
    );
  }

  getDeep(keys: string[] | string) {
    keys = splitKeys(keys);

    return (keys as string[]).reduce((acc, val) => {
      if (acc) {
        return acc[val];
      }

      return undefined;
    }, this.abp);
  }

  getFeature(key: string) {
    return this.abp.features?.values?.[key];
  }

  getFeature$(key: string) {
    return this.abp$.pipe(map((state) => state.features?.values?.[key]));
  }

  getSetting(key: string) {
    return this.abp.setting?.values?.[key];
  }

  getSetting$(key: string) {
    return this.abp$.pipe(map((state) => state.setting?.values?.[key]));
  }

  getSettingValue(keyword?: string) {
    const settings = this.abp.setting?.values || {};

    if (!keyword || !this.abp.setting?.values[keyword]) {
      return null;
    }

    return this.abp.setting?.values[keyword];
  }
  getSettings(keyword?: string) {
    const settings = this.abp.setting?.values || {};

    if (!keyword) {
      return settings;
    }

    const keysFound = Object.keys(settings).filter(
      (key) => key.indexOf(keyword) > -1
    );

    return keysFound.reduce((acc, key) => {
      acc[key] = settings[key];
      return acc;
    }, {});
  }

  getSettings$(keyword?: string) {
    return this.abp$.pipe(map((state) => state.setting?.values)).pipe(
      map((settings = {}) => {
        if (!keyword) {
          return settings;
        }

        const keysFound = Object.keys(settings).filter(
          (key) => key.indexOf(keyword) > -1
        );

        return keysFound.reduce((acc, key) => {
          acc[key] = settings[key];
          return acc;
        }, {});
      })
    );
  }
}

function splitKeys(keys: string[] | string): string[] {
  if (typeof keys === 'string') {
    keys = keys.split('.');
  }

  if (!Array.isArray(keys)) {
    throw new Error('The argument must be a dot string or an string array.');
  }

  return keys;
}
