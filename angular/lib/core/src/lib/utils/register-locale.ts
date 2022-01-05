import { isDevMode } from '@angular/core';

export const differentLocales = {
  'ar-001': 'ar-DZ',
  'ar-dz': 'ar-DZ',
  fr: 'fr',
  en: 'en',
  ar: 'ar-DZ',
};

export interface LocaleErrorHandlerData {
  resolve: any;
  reject: any;
  error: any;
  locale: string;
}

let localeMap = {};

export interface RegisterLocaleData {
  cultureNameLocaleFileMap?: Record<string, string>;
  errorHandlerFn?: (data: LocaleErrorHandlerData) => any;
}

export function registerLocale(
  {
    cultureNameLocaleFileMap = {},
    errorHandlerFn = defaultLocalErrorHandlerFn,
  } = {} as RegisterLocaleData
) {
  return (locale: string): Promise<any> => {
    localeMap = { ...differentLocales, ...cultureNameLocaleFileMap };
    const l = localeMap[locale] || locale;
    return new Promise((resolve, reject) => {
      return import(
        /* webpackChunkName: "_locale-[request]"*/
        /* webpackInclude: /[/\\](ar-DZ|en|fr).js/ */
        /* webpackExclude: /[/\\]global|extra/ */
        l === 'fr'
          ? `@angular/common/locales/fr`
          : l === 'ar'
          ? `@angular/common/locales/ar`
          : `@angular/common/locales/en`
      )
        .then(resolve)
        .catch((error) => {
          errorHandlerFn({
            resolve,
            reject,
            error,
            locale,
          });
        });
    });
  };
}

const extraLocales = {};
export function storeLocaleData(data: any, localeId: string) {
  extraLocales[localeId] = data;
}

export async function defaultLocalErrorHandlerFn({
  locale,
  resolve,
}: LocaleErrorHandlerData) {
  if (extraLocales[locale]) {
    resolve({ default: extraLocales[localeMap[locale] || locale] });
    return;
  }

  if (isDevMode) {
    console.error(
      `Cannot find the ${locale} locale file. You can check how can add new culture at https://docs.abp.io/en/abp/latest/UI/Angular/Localization#adding-a-new-culture`
    );
  }

  resolve();
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleValue {
  current = 'en-US';
  getLocale() {
    var ret = this.current || 'en-US';
    return ret;
  }
  setLocale(v) {
    this.current = v;
  }
}
