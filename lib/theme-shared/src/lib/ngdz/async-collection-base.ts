import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BaseAsyncComponent } from './base-async-component';
import { CrudOperation, SubSink } from '@abpdz/ng.core';
export class AsyncCollectionBase<ObjType> extends BaseAsyncComponent {
  subs = new SubSink();
  currentOperation: CrudOperation = CrudOperation.None;
  protected _current: Partial<ObjType>;
  public get current(): Partial<ObjType> {
    return this._current;
  }
  public set current(v: Partial<ObjType>) {
    if (this._current !== v) {
      this.current$.next(v);
    }
    this._current = v;
  }
  public current$: BehaviorSubject<Partial<ObjType>> = new BehaviorSubject<
    Partial<ObjType>
  >(null);

  public loading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  error: string = null;

  protected _items: ObjType[] = [];
  public get items(): ObjType[] {
    return this._items;
  }
  public set items(v: ObjType[]) {
    if (this._items !== v) {
      this.items$.next(v);
    }
    this._items = v;
  }
  public items$: BehaviorSubject<ObjType[]> = new BehaviorSubject<ObjType[]>(
    []
  );

  constructor(injector: Injector) {
    super(injector);
  }
  addSubscription(s: Subscription) {
    this.subs.add(s);
  }
  unsubscriptAll() {
    this.subs.unsubscribe();
  }
}
