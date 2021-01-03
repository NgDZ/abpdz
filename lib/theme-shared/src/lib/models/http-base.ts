import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  trim,
  filter as _filter,
  pickBy as _pickBy,
  matches as _matches,
  pad as _pad,
  values as _values,
} from 'lodash-es';
export interface IPage<TResult> {
  totalCount?: number;
  items?: TResult[];
}
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
export function CleanObjectProperties(filter) {
  return _pickBy(filter, isNotNullOrUndefined);
}
export interface IHttpService<TResult> {
  create(input?: TResult): Observable<TResult>;
  update(input?: TResult, id?): Observable<TResult>;
  delete(id): Observable<void>;
  get(id): Observable<TResult>;
  getId(item): any;
  getAll(
    param1?,
    param2?,
    param3?,
    param4?,
    param5?
  ): Observable<IPage<TResult>>;
}
export class AbpHttpService<TResult> implements IHttpService<TResult> {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
    protected idName = 'id'
  ) {}
  create(input?: TResult): Observable<TResult> {
    return this.http.post<TResult>(this.baseUrl + '/Create', input);
  }
  update(input?: TResult, id?): Observable<TResult> {
    return this.http.put<TResult>(this.baseUrl + '/Update', input);
  }
  delete(id): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/Delete?Id=' + id);
  }
  get(id): Observable<TResult> {
    return this.http.get<TResult>(this.baseUrl + '/Get?Id=' + id);
  }
  getId(item) {
    return item[this.idName];
  }
  getAll(
    param1?,
    param2?,
    param3?,
    param4?,
    param5?
  ): Observable<IPage<TResult>> {
    return this.http.get<IPage<TResult>>(this.baseUrl + '/GetAll', {
      params: param1,
    });
  }
  _getAll(param1?): Observable<IPage<TResult>> {
    return this.http.get<IPage<TResult>>(this.baseUrl + '/GetAll', {
      params: CleanObjectProperties(param1),
    });
  }
}
export class AbpIOHttpService<TResult> implements IHttpService<TResult> {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
    protected idName = 'id'
  ) {}
  create(input?: TResult): Observable<TResult> {
    return this.http.post<TResult>(this.baseUrl, input);
  }
  getId(item) {
    return item[this.idName];
  }
  update(input?: TResult, id?): Observable<TResult> {
    if (id == null) {
      id = (input as any).id;
    }
    return this.http.put<TResult>(this.baseUrl + '/' + id, input);
  }
  delete(id): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + id);
  }
  get(id): Observable<TResult> {
    return this.http.get<TResult>(this.baseUrl + '/' + id);
  }
  getAll(
    param1?,
    param2?,
    param3?,
    param4?,
    param5?
  ): Observable<IPage<TResult>> {
    return this.http.get<IPage<TResult>>(this.baseUrl, {
      params: param1,
    });
  }
  _getAll(param1?): Observable<IPage<TResult>> {
    return this.http.get<IPage<TResult>>(this.baseUrl, {
      params: CleanObjectProperties(param1),
    });
  }
}
