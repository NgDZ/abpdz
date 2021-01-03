import { map } from 'rxjs/operators';
import { AsyncDataSource } from './async-datasource';
import { IHttpService } from './http-base';

export class RestDataSource<NgEntity> extends AsyncDataSource<NgEntity> {
  constructor(protected api: IHttpService<NgEntity>) {
    super();
  }

  deleteServer(item: any) {
    return this.api.delete(this.api.getId(item)).pipe(map(() => item));
  }

  createServer(item: any) {
    return this.api.create(item);
  }
  updateServer(item: any) {
    return this.api.update(item, this.api.getId(item));
  }
  protected nextPage() {
    let param: any = {
      skipCount: this.page.value.pageIndex * this.page.value.pageSize,
      maxResultCount: this.page.value.pageSize,
      requestCount: this.requestCount,
    };
    if (this.filter.value) {
      param = { ...this.filter.value, ...param };
    }
    if (this.sort.value && this.sort.value.direction) {
      param.sort =
        this.sort.value.active +
        (this.sort.value.direction == 'desc' ? ' desc' : '');
    }
    return this.api.getAll(param).pipe(
      map((e) => {
        if (e.totalCount !== null) {
          this.requestCount = false;
          this.count.next(e.totalCount);
        }
        return e.items;
      })
    );
  }
}
