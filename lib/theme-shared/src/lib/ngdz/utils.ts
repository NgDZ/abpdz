import {
  trim,
  filter as _filter,
  pickBy as _pickBy,
  matches as _matches,
  pad as _pad,
  values as _values,
  sortBy,
  orderBy,
  slice,
  isNumber,
  isString,
} from 'lodash-es';

// import * as Fuse from 'fuse.js';
import Fuse from 'fuse.js';
import { ɵKeyEventsPlugin } from '@angular/platform-browser';
export type ObjectKeyMapping<T> = { [P in keyof T]?: any };

export function isNotNullOrUndefined(v) {
  if (v == null || v === undefined) {
    return false;
  }
  if (typeof v === 'string') {
    if (trim(v) === '') {
      return false;
    }
  }
  return true;
}

export function objectContainSubstring(obj, search: string): boolean {
  (document as any).iditem = obj;

  if (search != null && search !== '') {
    let values: any[];
    if (obj != null && obj._backingStore != null) {
      values = _values(obj._backingStore);
    } else {
      values = _values(obj);
    }
    for (const v of values) {
      if (isNumber(v)) {
        if (isNumber(search) && v === parseFloat(search)) {
          return true;
        }
      } else if (typeof v === 'string') {
        if (v != null) {
          const str = trim(v);
          if (str.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
            return true;
          }
        }
      } else if (search === v) {
        return true;
      }
    }

    return false;
  }
  return true;
}

export function filterTableWithOjbect<T>(
  _objects: T[],
  filter: any,
  filter$Search = true,
  filterFnc = null
): T[] {
  if (typeof filter === 'string') {
    return _filter(_objects, (u) => objectContainSubstring(u, _pad(filter)));
  }
  filter = Object.assign({}, filter);
  const search = _pad(filter.$search);
  filter.$search = null;
  filter = _pickBy(filter, isNotNullOrUndefined);
  let ret = _objects;
  if (filterFnc != null) {
    ret = _objects.filter(filterFnc);
  } else {
    ret = _filter(_objects, _matches(filter));
  }
  if (filter$Search && search != null && search !== '') {
    ret = _filter(ret, (u) => objectContainSubstring(u, search));
  }
  return ret;
  // return users;
}

export function filterTableWithFuse<T>(data: T[], filterObject, keys) {
  let filter = null;
  if (!isNotNullOrUndefined(filterObject)) {
    return data;
  }

  if (typeof filterObject === 'string') {
    filter = filterObject;
  }

  if (isNotNullOrUndefined(filterObject.$search)) {
    filter = filterObject.$search;
  }
  data = filterTableWithOjbect(data, filterObject, false);

  if (!isNotNullOrUndefined(filter)) {
    return data;
  }
  const fuse = new Fuse(data, {
    shouldSort: true,
    threshold: 0.3,
    tokenize: true,

    findAllMatches: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys,
    minMatchCharLength: 1,
  } as any);
  const ret = typeof filter === 'string' ? fuse.search(filter) : data;
  return ret as any;
}

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
export function CleanObjectProperties(filter) {
  return _pickBy(filter, isNotNullOrUndefined);
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
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
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
}
export function fileTimeName() {
  return new Date().toISOString().substr(0, 16).replace(':', '');
}
