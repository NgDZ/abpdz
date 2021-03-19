import { _isNumberValue } from '@angular/cdk/coercion';
import { MatSort, Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { AsyncDataSource } from './async-datasource';

export const MAX_SAFE_INTEGER = 9007199254740991;
export class LocalDataSource<NgEntity> extends AsyncDataSource<NgEntity> {
  all: NgEntity[] = [];
  allFiltred: NgEntity[] = [];
  filterFncVar = null;
  constructor() {
    super();
  }
  setData(data: NgEntity[]) {
    this.all = data;
    this.config.next({ data });
  }
  tapSort(s?: Sort) {
    if (s?.active != null) {
      if (this.allFiltred?.length > 0) {
        this.allFiltred = this.sortData(this.allFiltred, s);
      }
      if (this.all?.length > 0) {
        this.all = this.sortData(this.all, s);
      }
    }
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
    if (this.filterFncVar) {
      a = this.filterFncVar(a);
    }
    return a;
  }

  sortingDataAccessor: (
    data: NgEntity,
    sortHeaderId: string
  ) => string | number = (
    data: NgEntity,
    sortHeaderId: string
  ): string | number => {
    const value = (data as { [key: string]: any })[sortHeaderId];

    if (_isNumberValue(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }

    return value;
  };

  sortData: (data: NgEntity[], sort: Sort) => NgEntity[] = (
    data: NgEntity[],
    sort: Sort
  ): NgEntity[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') {
      return data;
    }

    return data.sort((a, b) => {
      let valueA = this.sortingDataAccessor(a, active);
      let valueB = this.sortingDataAccessor(b, active);

      // If there are data in the column that can be converted to a number,
      // it must be ensured that the rest of the data
      // is of the same type so as not to order incorrectly.
      const valueAType = typeof valueA;
      const valueBType = typeof valueB;

      if (valueAType !== valueBType) {
        if (valueAType === 'number') {
          valueA += '';
        }
        if (valueBType === 'number') {
          valueB += '';
        }
      }

      // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
      // one value exists while the other doesn't. In this case, existing value should come last.
      // This avoids inconsistent results when comparing values to undefined/null.
      // If neither value exists, return 0 (equal).
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }

      return comparatorResult * (direction == 'asc' ? 1 : -1);
    });
  };
  protected nextPage() {
    let param = {
      skipCount: this.page.value.pageIndex * this.page.value.pageSize,
      maxResultCount: this.page.value.pageSize,
      requestCount: this.requestCount,
    };
    console.log('nex page ', param);
    if (this.requestCount) {
      this.requestCount = false;
      this.allFiltred = param.requestCount
        ? this.filterFnc(this.all)
        : this.allFiltred;
      this.count.next(this.allFiltred.length);
    }
    return of(
      this.allFiltred.slice(
        param.skipCount,
        param.skipCount + param.maxResultCount
      )
    );
  }
}
