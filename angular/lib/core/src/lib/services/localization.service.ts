import {
  Injectable,
  Injector,
  isDevMode,
  NgZone,
  Optional,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { selectExtraLocalizationData, selectLocalizationData } from '../ngrx';
import { mergeWith } from 'lodash-es';
import { SessionStateService } from './session-state.service';
import { ConfigStateService } from './config-state.service';
import { SkipSelf } from '@angular/core';
import { CORE_OPTIONS } from '../tokens';
import { ABP, ApplicationConfiguration, Config } from '../models';
import { interpolate } from '../utils/string-utils';
/**
 * This loader is just a placeholder that does nothing, in case you don't need a loader at all
 */

function getLocalization(
  state: ApplicationConfiguration.Response,
  key: string | Config.LocalizationWithDefault,
  ...interpolateParams: string[]
) {
  if (!key) {
    key = '';
  }
  let defaultValue: string;

  if (typeof key !== 'string') {
    defaultValue = key.defaultValue;
    key = key.key;
  }

  const keys = key.split('::') as string[];
  const warn = (message: string) => {
    if (isDevMode) {
      // console.warn(message);
    }
  };

  if (keys.length < 2) {
    warn('The localization source separator (::) not found.');
    return defaultValue || (key as string);
  }
  if (!state) {
    return defaultValue || keys[1];
  }

  const sourceName = keys[0] || state.localization.defaultResourceName;
  const sourceKey = keys[1];

  if (sourceName === '_') {
    return defaultValue || sourceKey;
  }

  if (!sourceName) {
    warn(
      'Localization source name is not specified and the defaultResourceName was not defined!'
    );

    return defaultValue || sourceKey;
  }

  const source = state[sourceName];
  if (!source) {
    warn('Could not find localization source: ' + sourceName);
    return defaultValue || sourceKey;
  }

  let localization = source[sourceKey];
  if (typeof localization === 'undefined') {
    return defaultValue || sourceKey;
  }

  interpolateParams = interpolateParams.filter((params) => params != null);
  if (localization) {
    localization = interpolate(localization, interpolateParams);
  }

  if (typeof localization !== 'string') {
    localization = '';
  }

  return localization || defaultValue || (key as string);
}

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  /**
   * Returns currently selected language
   */

  locales$: Observable<any>;
  locales: any;

  getTranslation(lang: string): Observable<any> {
    return this.locales$;
  }

  constructor(private store: Store) {
    this.locales$ = combineLatest([
      store.select(selectLocalizationData),

      store.select(selectExtraLocalizationData),
    ]).pipe(
      map(([localizationData, extraLocalizationData]) => ({
        localizationData,
        extraLocalizationData,
      })),
      map((k) => {
        const re = {};
        if (k.localizationData) {
          mergeWith(re, k.localizationData);
        }
        if (k.extraLocalizationData) {
          mergeWith(re, k.extraLocalizationData);
        }
        return re;
      }),
      shareReplay()
    );
    this.listenToSetLanguage();
  }

  private listenToSetLanguage() {
    this.locales$.subscribe((k) => {
      this.locales = k;
    });
  }
  instant(
    key: string | Config.LocalizationWithDefault,
    ...interpolateParams: string[]
  ): string {
    return getLocalization(this.locales, key, ...interpolateParams);
  }
}
