import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';

import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { CollectionViewer } from '@angular/cdk/collections';
import {
  filter as _filter,
  pickBy as _pickBy,
  matches as _matches,
  pad as _pad,
  values as _values,
  sortBy,
  orderBy,
  slice,
} from 'lodash-es';
import { map, take, tap, switchMap, shareReplay } from 'rxjs/operators';
import { objectContainSubstring } from './utils';
export class NgdzObservableTableDataSource<T> extends DataSource<T> {
  protected _pageItems: T[] = [];

  page: PageEvent = this.defaultPage();

  refresh$ = new BehaviorSubject<any>(0);
  filterFnc: (f: T) => boolean;
  public data: T[];
  public filtredData: T[] = [];
  public useSearchSort: any;
  constructor(
    public data$: Observable<T[]>,
    public page$?: BehaviorSubject<PageEvent>,
    public sort$?: BehaviorSubject<Sort>,
    public filter$?: Observable<any>,
    public count$?: BehaviorSubject<number>
  ) {
    super();
    if (page$ == null) {
      this.page$ = new BehaviorSubject<PageEvent>(this.defaultPage());
    }
    if (sort$ == null) {
      this.sort$ = new BehaviorSubject<Sort>(null);
    }
    if (filter$ == null) {
      this.filter$ = new BehaviorSubject<any>(null);
    }
    if (count$ == null) {
      this.count$ = new BehaviorSubject<number>(0);
    }
  }

  connect(collectionViewer?: CollectionViewer): Observable<T[]> {
    // TODO: optmise in case of local filter

    const ret$ = combineLatest(
      this.data$.pipe(tap((data) => (this.data = data))),
      this.filter$,
      this.refresh$,
      (data, filter) => {
        return { data, filter };
      }
    ).pipe(
      map((v) => {
        const ret = this.localFilter(v.data, v.filter);
        this.count$.next(ret.length);
        this.filtredData = ret;

        return ret;
      }),
      switchMap((fItems) => {
        return this.sort$.pipe(
          map((sort) => {
            const ret = this._sortData(fItems, sort);
            this.filtredData = ret;
            return ret;
          })
        );
      }),
      switchMap((fItems) => {
        return this.page$.pipe(
          tap((p) => (this.page = p)),
          map((page) => {
            const ret = this._pageData(fItems, page);
            this._pageItems = ret;
            return [...ret];
          })
        );
      }),
      shareReplay()
    );

    return ret$;
  }
  protected _pageData(data: T[], page: PageEvent): T[] {
    if (page != null) {
      const startIndex = page.pageIndex * page.pageSize;
      if (startIndex > data.length) {
        return slice(data, 0, page.pageSize);
      }
      return slice(data, startIndex, startIndex + page.pageSize); // data.splice(startIndex, page.pageSize);
    } else {
      return data;
    }
  }
  protected _sortData(data: T[], sort: Sort): T[] {
    if (this.useSearchSort != null) {
      return data;
    }
    if (sort != null && sort.active != null) {
      let direction = 'asc';
      if (sort.direction === 'desc') {
        direction = 'desc';
      }
      data = orderBy(data, [sort.active], <any>[sort.direction]);
    }
    return data;
  }

  disconnect(collectionViewer?: CollectionViewer): void {
    // No-op
  }
  refresh(server?) {
    this.refresh$.next(server);
  }
  create(newitem?: T): T {
    if (newitem == null) {
      newitem = <any>{};
    }
    this.data.push(newitem);
    this.refresh(false);

    return newitem;
  }
  delete(e: T) {
    this.data.splice(this.data.indexOf(e), 1);
    this.refresh(false);
  }

  _isNotNull(v) {
    return v !== null && v !== undefined;
  }
  localFilter(_objects: T[], filter: any): T[] {
    if (typeof filter === 'string') {
      return _filter(_objects, (u) => objectContainSubstring(u, _pad(filter)));
    }
    filter = Object.assign({}, filter);
    const search = _pad(filter['$search']);
    filter['$search'] = null;
    filter = _pickBy(filter, this._isNotNull);
    let ret = _objects;
    if (this.filterFnc != null) {
      ret = _objects.filter(this.filterFnc);
    } else {
      ret = _filter(_objects, _matches(filter));
    }
    if (search != null && search !== '') {
      ret = _filter(ret, (u) => objectContainSubstring(u, search));
    }
    return ret;
    // return users;
  }

  protected defaultPage(): PageEvent {
    return <any>{ pageIndex: 0, pageSize: 10 };
  }
}
