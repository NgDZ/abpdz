import { TemplateRef, Type } from '@angular/core';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Serializable ? DeepPartial<T[P]> : T[P];
};

type Serializable = Record<
  string | number | symbol,
  string | number | boolean | Record<string | number | symbol, any>
>;

export type InferredInstanceOf<T> = T extends Type<infer U> ? U : never;
export type InferredContextOf<T> = T extends TemplateRef<infer U> ? U : never;

export type Strict<Class, Contract> = Class extends Contract
  ? { [K in keyof Class]: K extends keyof Contract ? Contract[K] : never }
  : Contract;

export function newGuid() {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
export const EMPTYGUID = '00000000-0000-0000-0000-000000000000';
export function HttpGetListParams(name: string, value: any): any {
  if (value == null || typeof value === 'string') {
    return name + '=' + value;
  }
  let ret = '';
  value.forEach((v) => {
    if (v == null) {
      return;
    }
    if (ret === '') {
      ret += name + '=' + v;
    } else {
      ret += '&' + name + '=' + v;
    }
  });
  return ret;
}

export function resetForm(form: any) {
  form.reset();

  Object.keys(form.controls).forEach((key) => {
    form.get(key).setErrors(null);
    if (form.get(key).controls != null) {
      resetForm(form.get(key));
    }
  });
}
export function formatDateIso(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function downloadFileFromText(text, filename) {
  const pom = document.createElement('a');
  pom.download = filename;
  pom.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}
export function downloadFileFromBlob(blob, filename) {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
}
export function fileTimeName() {
  return new Date().toISOString().substr(0, 16).replace(':', '');
}
