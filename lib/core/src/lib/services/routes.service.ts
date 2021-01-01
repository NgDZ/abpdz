import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { eLayoutType } from '../enums/common';
import { ABP } from '../models/common';
import { addMenuAction } from '../ngrx/abp.actions';
import { selectVisibleMenu } from '../ngrx/abp.reducer';
import { SubSink } from '../utils/subsink';
interface MenuSelected {
  map: {
    [key: string]: ABP.Nav;
  };
  menu: {
    [key: string]: ABP.Nav[];
  };
}
@Injectable({ providedIn: 'root' })
export class RoutesService implements OnDestroy {
  subs = new SubSink();
  select: MenuSelected;
  select$: Observable<MenuSelected>;

  public get visible$(): Observable<ABP.Nav[]> {
    return this.select$.pipe(map((k) => k.menu[eLayoutType.application]));
  }
  constructor(private store: Store) {
    this.select$ = this.store
      .select(selectVisibleMenu)
      .pipe(tap((k) => (this.select = k as any))) as any;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  add(a: ABP.Nav[]) {
    this.store.dispatch(addMenuAction({ data: a }));
  }
  hasChildren(a) {
    return this.select?.map[a]?.children.length > 0;
  }
}
