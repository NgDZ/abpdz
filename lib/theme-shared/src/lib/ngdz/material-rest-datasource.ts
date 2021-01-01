import {
  ViewChild,
  Injector,
  TemplateRef,
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  Optional,
  Inject,
  InjectionToken,
} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, combineLatest, Subject } from 'rxjs';
import { IHttpService, RestServiceCollection, IPage } from './rest-collection';
import { CrudOperation } from '@abpdz/ng.core';
import { FormGroup } from '@angular/forms';
import { pickBy as _pickBy } from 'lodash-es';
import { LoggerService } from '../services';
import {
  tap,
  switchMap,
  catchError,
  map,
  shareReplay,
  debounceTime,
  take,
  takeUntil,
  switchMapTo,
} from 'rxjs/operators';

interface IGetAllPrams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: any;
}
/** An example database that the data source uses to retrieve data for the table. */

export class RestMaterialDataSource<datatype> extends DataSource<datatype> {
  // The number of issues returned by github matching the query.
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
  public data$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public count$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public disconnect$: Subject<number> = new Subject<number>();
  intercept: (a: datatype[]) => Observable<datatype[]>;

  filter: any = {};
  protected _items: datatype[] = [];

  public get items(): datatype[] {
    return this._items;
  }
  public set items(v: datatype[]) {
    this._items = v;
    this.items$.next(v);
  }

  public refresh$ = new BehaviorSubject<any>(0);
  public items$: BehaviorSubject<datatype[]> = new BehaviorSubject<datatype[]>(
    []
  );

  // isLoadingResults = false;
  // isRateLimitReached = false;
  ayncAdd = (any) => {};
  newCollection = (any) => {};

  constructor(
    public http: Partial<IHttpService<datatype>>,
    private page$: BehaviorSubject<PageEvent>,
    private sort$: Observable<Sort>,
    private filter$?: Observable<any>
  ) {
    super();
    if (this.filter$ == null) {
      this.filter$ = new BehaviorSubject<any>({});
    }
  }
  _isNotNull(v) {
    return v !== null && v !== undefined;
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  // tslint:disable-next-line:member-ordering
  connect$: Observable<datatype[]>;
  connect(): Observable<datatype[]> {
    if (this.connect$ != null) {
      return this.connect$;
    }

    // tslint:disable-next-line: deprecation
    const filterChanged$ = combineLatest(
      this.page$,
      this.sort$,
      this.filter$.pipe(
        tap((v) => {
          this.filter = _pickBy(v, this._isNotNull);
        })
      ),
      this.refresh$,

      (page, sort, filter, refresh) => {
        return { page, sort, filter, refreshServer: refresh };
      }
    );
    // If the user changes the sort order, reset back to the first page.

    let ret$ = filterChanged$.pipe(
      debounceTime(50),
      //   .startWith(null)
      switchMap((v) => {
        this.ayncAdd(1);

        const http$ = this.getAllMethode(this.http, {
          page: v.page.pageIndex,
          pageSize: v.page.pageSize,
          sort: this.sortDirection(v.sort),
          filter: this.filter,
        }); // .pipe(finalize(() => this.ayncAdd(-1)));
        return http$;
      }),
      switchMap((data) => {
        // Flip flag to show that loading has finished.
        this.ayncAdd(-1);
        this.count = data.totalCount;
        this.newCollection(data.items);
        this.items = data.items;
        data.items = null;
        this.data$.next(data);
        return this.items$;
      }),
      catchError(() => {
        return of([] as datatype[]);
      })
    );

    const disconnect$ = this.disconnect$.pipe(take(1));
    disconnect$.subscribe((v) => {
      this.connect$ = null;
    });

    this.connect$ = ret$.pipe(
      switchMap((k) => (this.intercept ? this.intercept(k) : of(k))),
      shareReplay(),
      takeUntil(disconnect$)
    );
    return this.connect$;
  }

  getAllMethode = function (
    http,
    param: IGetAllPrams
  ): Observable<IPage<datatype>> {
    if (http._getAll != null) {
      const p = Object.assign(
        {
          maxResultCount: param.pageSize,
          skipCount: param.page * param.pageSize,
          sorting: param.sort,
        },
        param.filter
      );
      return http._getAll(p);
    }
    return http.getAll(param.pageSize, param.page * param.pageSize, param.sort);
  };

  private sortDirection(sort: Sort): string {
    if (sort == null || sort.active == null || sort.direction === '') {
      return undefined;
    }
    return sort.active + (sort.direction === 'desc' ? ' DESC' : '');
  }

  disconnect() {
    this.disconnect$.next(0);
  }
}

export const HTTP_CLIENT_TOKEN = new InjectionToken<string>(
  'HTTP_CLIENT_TOKEN'
);

@Component({
  template: '',
})
export class RestMaterialTableComponent<datatype>
  extends RestServiceCollection<datatype>
  implements AfterViewInit {
  @ViewChild('editDialog', { static: true })
  template: TemplateRef<any>;
  displayedColumns = [];
  dataSource: RestMaterialDataSource<datatype> | null;
  editForm: FormGroup;
  dialogRef: MatDialogRef<any>;

  private _page: PageEvent = this.defaultPage();
  public get page(): PageEvent {
    return this._page;
  }
  public set page(v: PageEvent) {
    const changed = this._page !== v;
    this._page = v;
    this.page$.next(v);
  }

  page$ = new BehaviorSubject<PageEvent>(this.defaultPage());
  sort$ = new BehaviorSubject<Sort>(null);

  count$;
  protected dialog: MatDialog = this.injector.get(MatDialog);
  // protected cd: ChangeDetectorRef = this.injector.get(ChangeDetectorRef);
  constructor(
    @Optional()
    @Inject(HTTP_CLIENT_TOKEN)
    http: Partial<IHttpService<datatype>>,
    injector: Injector
  ) {
    super(injector, http);
  }
  ngAfterViewInit() {
    this.prepareComponent();
    this.ngdzAfterViewInit();
  }
  ngdzAfterViewInit() {}

  prepareComponent() {
    //   this.exampleDatabase = new IHttpService<datatype>();
    this.dataSource = new RestMaterialDataSource<datatype>(
      this.http,
      this.page$,
      this.sort$,
      this.filter$
    );
    this.dataSource.newCollection = (c) => {
      this.items = c;
    };
    this.dataSource.ayncAdd = (i) => {
      if (i === 1) {
        this.startAsync();
      } else {
        this.endAsync();
      }
    };
    this.cd.markForCheck();
  }
  newObject(): Observable<Partial<datatype>> {
    return of({});
  }
  newEdit() {
    this.newObject().subscribe((k) => {
      this.currentOperation = CrudOperation.Create;
      this.dialogEdit(k);
    });
  }
  dialogEdit(entity: Partial<datatype>) {
    this.current = entity;
    if (this.editForm != null) {
      this.editForm.reset(entity);
    }
    this.dialogRef = this.dialog.open(this.template, {
      data: Object.assign({}, entity),
      panelClass: ['overflow-auto', 'p-0'],
      maxWidth: '90vw',
      disableClose: true,
    }); // , this.current
  }
  resetFilter() {
    this.page.pageIndex = 0;
    this.page = Object.assign({}, this.page);

    this.page$.next(this.page);
  }
  startEdit(entity: Partial<datatype>) {
    this.currentOperation = CrudOperation.Update;
    this.dialogEdit(entity);
  }
  closeDialog() {
    if (this.dialogRef != null) {
      this.dialogRef.close();
    }
  }
  cancel() {
    this.closeDialog();
  }

  protected defaultPage(): PageEvent {
    return { pageIndex: 0, pageSize: 10 } as any;
  }
  canSave(): boolean {
    return this.editForm != null && this.editForm.valid;
  }
  save(item?) {
    if (item == null) {
      item = { ...this.current, ...this.editForm.value };
    }
    super.save(item);
  }
  afterUpdate(data) {
    Object.assign(this.current, data);
    super.afterUpdate();
    this.items = [...this.items];
    this.dataSource.items = this.items;
    this.closeDialog();
    this.cd.markForCheck();
  }

  afterCreate(v?) {
    this.closeDialog();
    super.afterCreate(v);
    this.items = [...this.items];
    this.dataSource.items = this.items;
    this.count++;
    this.cd.markForCheck();
  }
  afterDelete() {
    super.afterDelete();
    this.count--;
    this.dataSource.items = [...this.items];
  }
  refresh() {
    this.dataSource.refresh$.next(null);
  }
}
