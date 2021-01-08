import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of as observableOf, combineLatest, from, of } from 'rxjs';
import { Entity, EntityManager, EntityQuery } from 'breeze-client';
import { AsyncDataSource } from '@abpdz/ng.theme.shared';
import { executeObservableQuery } from './breeze-helpers';

/**
 * Data source for the Orders view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class BreezeServerDataSource<
  NgEntity
> extends AsyncDataSource<NgEntity> {
  constructor() {
    super();
  }

  buidBreezeQuery(query: EntityQuery) {
    const startIndex = this.page.value.pageIndex * this.page.value.pageSize;
    if (startIndex) {
      query = query.skip(startIndex);
    }
    query = query.take(this.page.value.pageSize);
    if (this.requestCount) {
      query = query.inlineCount(true);
    }
    if (this.sort.value.active) {
      query = query.orderBy(
        this.sort.value.active,
        this.sort.value.direction === 'asc'
      );
    }
    return query;
  }

  deleteServer(item: any) {
    const bem = this.getEntityManager();
    if (bem) {
      item.entityAspect.setDeleted();
      return from(bem.saveChanges([item]));
    } else {
      of(item);
    }
  }

  private getEntityManager() {
    return this.config.value.em as EntityManager;
  }

  protected nextPage() {
    if (this.config.value.em == null) {
      return of([]);
    }
    const conf = this.config.value;
    return executeObservableQuery<NgEntity[]>(
      conf.em,
      conf.collection,
      null,
      (query: EntityQuery) => this.buidBreezeQuery(query)
    ).pipe(
      map((e) => {
        if (e.inlineCount !== null) {
          this.requestCount = false;
          this.count.next(e.inlineCount);
        }
        return e.results;
      })
    );
  }
}
