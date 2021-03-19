import { DataSource } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { switchMap, tap, shareReplay, take } from 'rxjs/operators';
import {
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  of,
  Subject,
} from 'rxjs';
import { CrudOperation, LocalizationService } from '@abpdz/ng.core';
import { LoggerService } from '../services/logger.service';

/**
 * Data source for the Orders view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AsyncDataSource<NgEntity> extends DataSource<NgEntity> {
  logger: LoggerService;
  translate: LocalizationService;
  setServices(logger: LoggerService, translate: LocalizationService) {
    this.logger = logger;

    this.translate = translate;
  }
  protected _loading = 0;
  public get loading(): number {
    return this._loading;
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  public set loading(v: number) {
    if (v < 0) {
      v = 0;
    }
    if (this._loading !== v) {
      this.loading$.next(v);
    }
    if (v < 0) {
      v = 0;
    }
    this._loading = v;
  }
  public loading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  data: BehaviorSubject<NgEntity[]> = new BehaviorSubject<NgEntity[]>([]);
  current: BehaviorSubject<NgEntity> = new BehaviorSubject<NgEntity>(null);
  events: Subject<{
    operation: CrudOperation;
    item: NgEntity;
  }> = new Subject<{
    operation: CrudOperation;
    item: NgEntity;
  }>();
  page: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>({
    pageIndex: 0,

    pageSize: 10,
    length: 15,
  });
  operation: CrudOperation = null;
  sort: BehaviorSubject<Sort | any> = new BehaviorSubject<Sort | any>({
    active: null,
    direction: null,
  });
  group: BehaviorSubject<Sort> = new BehaviorSubject<any>({});

  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  requestCount = true;
  filter: BehaviorSubject<any> = new BehaviorSubject<any>({});
  config: BehaviorSubject<any> = new BehaviorSubject<any>({});
  protected connect$: Observable<any>;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<NgEntity[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.page,
      this.sort.pipe(tap((s) => this.tapSort(s))),
      this.group,
      this.filter.pipe(
        tap(() => {
          this.tapFilter();
        })
      ),
      this.config.pipe(
        tap(() => {
          this.tapConfig();
        })
      ),
    ];
    if (this.connect$ == null) {
      this.connect$ = combineLatest(dataMutations).pipe(
        switchMap(() => {
          this.loading++;
          return this.nextPage().pipe(take(1));
        }),
        switchMap((k) => {
          this.data.next(k as any);
          return this.data;
          // this.count.next(k.length);
        }),
        tap(
          () => this.loading--,
          (e) => {
            this.logger?.asyncError(e);
            this.loading--;
          }
        ),
        shareReplay()
      ) as any;
    }
    return this.connect$;
  }
  tapSort(sort?: any): void {}

  private tapConfig(config?: any) {
    this.page.value.pageIndex = 0;
    this.requestCount = true;
  }

  private tapFilter(filter?: any) {
    this.page.value.pageIndex = 0;
    this.requestCount = true;
  }

  // implment this function to retive next page
  protected nextPage() {
    return of([] as NgEntity[]);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
  deleteServer(item: any): Observable<any> {
    return of(item);
  }
  confirmDelete(item) {
    return of(true);
  }
  delete$(item: any): Observable<any> {
    this.loading++;
    return this.deleteServer(item).pipe(
      tap(
        () => {
          this.loading--;
          this.deleteLocal(item);
        },
        (e) => {
          this.logger?.asyncError(e);
          this.loading--;
          return null;
        }
      )
    );
  }
  delete(item) {
    var confirmDelete = 'Are you sure you want to delete this item?';
    if (this.translate) {
      confirmDelete = this.translate.instant('AbpDz::ConfirmDelete');
    }
    if (confirm(confirmDelete)) {
      this.delete$(item).subscribe(
        () => {},
        () => {}
      );
    }
  }

  protected deleteLocal(item) {
    let index = this.data.value.indexOf(item);
    if (index < 0) {
      index = this.data.value.indexOf(this.current.value);
    }
    this.data.value.splice(index, 1);

    this.events.next({ operation: CrudOperation.Delete, item: item });
    this.count.next(this.count.value - 1);
    this.operation = null;
    this.data.next(this.data.value);
  }

  initCreate$ = (item?) => of(item);

  initUpdate$ = (item?) => of(item);

  createServer(item: any): Observable<any> {
    return of(item);
  }
  create$(item: any): Observable<any> {
    this.loading++;
    return this.createServer(item).pipe(
      tap(
        () => {
          this.loading--;
          this.createLocal(item);
        },
        (e) => {
          this.logger?.asyncError(e);
          this.loading--;
          return null;
        }
      )
    );
  }
  create(item) {
    this.create$(item).subscribe(
      () => {},
      () => {}
    );
  }

  protected createLocal(item) {
    this.count.next(this.count.value + 1);
    this.operation = null;
    this.events.next({ operation: CrudOperation.Create, item: item });
    this.data.next([...this.data.value, item]);
  }

  updateServer(item: any): Observable<any> {
    return of(item);
  }
  update$(orginalItem: any): Observable<any> {
    this.loading++;
    return this.updateServer(orginalItem).pipe(
      tap(
        (newItem) => {
          this.loading--;
          this.updateLocal(orginalItem, newItem);
        },
        (e) => {
          this.logger?.asyncError(e);
          this.loading--;
          return null;
        }
      )
    );
  }
  update(item) {
    this.update$(item).subscribe(
      () => {},
      () => {}
    );
  }

  protected updateLocal(item, newItem) {
    this.operation = null;
    let index = this.data.value.indexOf(item);
    if (index < 0) {
      index = this.data.value.indexOf(this.current.value);
    }
    this.events.next({ operation: CrudOperation.Update, item: item });

    this.data.next([
      // part of the array before the specified index
      ...this.data.value.slice(0, index),
      // inserted item
      newItem,
      // part of the array after the specified index
      ...this.data.value.slice(index + 1),
    ]);
  }
}
