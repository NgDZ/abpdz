import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCollectionBase } from './async-collection-base';
import { LoggerService } from '../services';
import { CleanObjectProperties } from './utils';
import { CrudOperation } from '@abpdz/ng.core';

export interface IPage<TResult> {
  totalCount?: number;
  items?: TResult[];
}

export interface IHttpService<TResult> {
  create(input?: TResult): Observable<TResult>;
  update(input?: TResult, id?): Observable<TResult>;
  delete(id): Observable<void>;
  get(id): Observable<TResult>;
  getAll(
    param1?,
    param2?,
    param3?,
    param4?,
    param5?
  ): Observable<IPage<TResult>>;
}

export class AbpHttpService<TResult> implements IHttpService<TResult> {
  constructor(protected http: HttpClient, protected baseUrl: string) {}
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
  constructor(protected http: HttpClient, protected baseUrl: string) {}
  create(input?: TResult): Observable<TResult> {
    return this.http.post<TResult>(this.baseUrl, input);
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
export class RestServiceCollection<datatype> extends AsyncCollectionBase<
  datatype
> {
  protected _count: number;
  public get count(): number {
    return this._count;
  }
  public set count(v: number) {
    if (this._count !== v) {
      this.count$.next(v);
    }
    this._count = v;
  }
  public count$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  protected _filter: any;
  public get filter(): any {
    return this._filter;
  }
  public set filter(v: any) {
    if (this._filter !== v) {
      this.filter$.next(v);
      this.resetFilter();
    }
    this._filter = v;
  }
  public filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    injector: Injector,
    protected http: Partial<IHttpService<datatype>>
  ) {
    super(injector);
  }

  protected startAsync() {
    this.loading++;
    if (this.cd != null) {
      this.cd.markForCheck();
    }
  }

  endAsync() {
    this.loading--;
    if (this.cd != null) {
      this.cd.markForCheck();
    }
  }
  resetFilter() {}
  protected errorAsync(error) {
    this.endAsync();
    this.error = error;
    if (this.logger != null) {
      this.logger.asyncError(error);
    }
  }
  refresh() {
    this.startAsync();
    this.http.getAll(this.filter).subscribe(
      () => {
        this.afterLoad(this.items);
        this.endAsync();
      },
      (e) => this.errorAsync(e)
    );
  }

  save(item?) {
    if (this.currentOperation === CrudOperation.Create) {
      this.create(item);
    } else if (this.currentOperation === CrudOperation.Update) {
      this.update(item);
    }
  }
  create(item: datatype) {
    this.startAsync();
    this.http.create(item).subscribe(
      (v) => {
        this.items.push(v);
        this.items = [...this.items];
        this.afterCreate(v);
        this.count++;
        this.endAsync();
      },
      (e) => this.errorAsync(e)
    );
  }
  update(item: datatype) {
    this.startAsync();
    this.http.update(item).subscribe(
      () => {
        this.afterUpdate(item);
        this.endAsync();
      },
      (e) => this.errorAsync(e)
    );
  }
  delete(item: Partial<datatype>) {
    if (
      confirm(this.translate.instant('Ezyness::DeletionConfirmationMessage'))
    ) {
      this.startAsync();
      this.http.delete(this.getId(item)).subscribe(
        () => {
          this.items.splice(this.items.indexOf(item as datatype), 1);
          this.items = [...this.items];
          this.afterDelete(item);
          this.count--;
          this.endAsync();
        },
        (e) => this.errorAsync(e)
      );
    }
  }

  getId(item: Partial<datatype>): string {
    if ((item as any).id !== null) {
      return (item as any).id;
    }
    return '';
  }

  afterDelete(v?) {}
  afterCreate(v?) {}
  afterUpdate(v?) {}
  afterLoad(v?) {}
}

export class RestCollection<datatype> extends AsyncCollectionBase<datatype> {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
    injector: Injector
  ) {
    super(injector);
  }
  protected startAsync() {
    this.loading++;
  }

  endAsync() {
    this.loading--;
    if (this.cd != null) {
      this.cd.markForCheck();
    }
  }
  protected errorAsync(error) {
    this.endAsync();
    this.error = error;
  }
  refresh() {
    this.startAsync();
    this.http.get<datatype[]>(this.baseUrl).subscribe(
      (o) => {
        this.items = o;
        this.afterLoad(this.items);
        this.endAsync();
      },
      (e) => this.errorAsync(e)
    );
  }

  save(item?) {
 
    if (this.currentOperation === CrudOperation.Create) {
      this.create(item);
    } else if (this.currentOperation === CrudOperation.Update) {
      this.update(item);
    }
  }

  create(item: Partial<datatype>) {
    this.http.post<datatype>(this.baseUrl, item).subscribe(
      (v) => {
        this.items.push(v);
        this.endAsync();
        this.afterCreate(v);
      },
      (e) => this.errorAsync(e)
    );
  }
  update(item: Partial<datatype>) {
    this.startAsync();
    this.http
      .put<datatype>(this.baseUrl + '/' + this.getId(item), item)
      .subscribe(
        () => {
          this.afterUpdate(item);
          this.endAsync();
        },
        (e) => this.errorAsync(e)
      );
  }
  delete(item: Partial<datatype>) {
    this.startAsync();
    this.http.delete<datatype>(this.baseUrl + '/' + this.getId(item)).subscribe(
      () => {
        this.items.splice(this.items.indexOf(item as datatype), 1);
        this.afterDelete(item);
        this.refresh();
        this.endAsync();
      },
      (e) => this.errorAsync(e)
    );
  }

  getId(item: Partial<datatype>): string {
    if ((item as any).id !== null) {
      return (item as any).id;
    }
    return '';
  }

  afterDelete(v?) {}
  afterCreate(v?) {}
  afterUpdate(v?) {}
  afterLoad(v?) {}
}
