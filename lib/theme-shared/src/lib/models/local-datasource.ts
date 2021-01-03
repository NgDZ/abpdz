import {
  of,
} from 'rxjs';
import { AsyncDataSource } from './async-datasource';

export class LocalDataSource<NgEntity> extends AsyncDataSource<NgEntity> {
  all: NgEntity[] = [];
  allFiltred: NgEntity[] = [];
  constructor() {
    super();
  }
  setData(data: NgEntity[]) {
    this.config.next({ data });
  }

  deleteServer(item: any) {
    let index = this.all.indexOf(item);
    if (index < 0) {
      index = this.all.indexOf(this.current.value);
    }
    this.all.splice(index, 1);
    return of(item);
  }

  createServer(item: any) {
    this.all.push(item);
    return of(item);
  }
  updateServer(item: any) {
    this.operation = null;
    let index = this.all.indexOf(item);
    if (index < 0) {
      index = this.all.indexOf(this.current.value);
    }
    this.data.next([
      // part of the array before the specified index
      ...this.all.slice(0, index),
      // inserted item
      item,
      // part of the array after the specified index
      ...this.all.slice(index + 1),
    ]);
    return of(item);
  }
  filterFnc(a: NgEntity[]): NgEntity[] {
    return a;
  }
  protected nextPage() {
    let param = {
      skipCount: this.page.value.pageIndex * this.page.value.pageSize,
      maxResultCount: this.page.value.pageSize,
      requestCount: this.requestCount,
    };

    this.allFiltred = param.requestCount
      ? this.filterFnc(this.all)
      : this.allFiltred;
    this.count.next(this.allFiltred.length);
    return of(this.allFiltred.slice(param.skipCount, param.maxResultCount));
  }
}
