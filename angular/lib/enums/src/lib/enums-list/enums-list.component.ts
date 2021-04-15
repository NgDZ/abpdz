import { Component, Injector  } from '@angular/core';

import { AbpEnumServiceProxy } from '../enums.sdk';
import { MatDialog } from '@angular/material/dialog';
import { EnumsDetailComponent } from '../enums-detail/enums-detail.component';
import { HttpClient } from '@angular/common/http';
import {
  abpAnimations,
  BaseAsyncComponent, 
  LocalDataSource,
} from '@abpdz/ng.theme.shared';
import { AbpEnum, CrudOperation, downloadFileFromText } from '@abpdz/ng.core';
@Component({
  selector: 'gsso-enums-list',
  templateUrl: './enums-list.component.html',
  styleUrls: ['./enums-list.component.scss'],
  viewProviders: [AbpEnumServiceProxy],
  animations: abpAnimations,
})
export class EnumsListComponent extends BaseAsyncComponent {
  current: AbpEnum;
  dictionary: any = {};
  operation: CrudOperation;
  all: AbpEnum[];
  types: AbpEnum[];
  columns = ['display', 'Actions'];
  dataSource = new LocalDataSource<AbpEnum>();
  currentType: AbpEnum = null;
  constructor(
    injector: Injector,
    public api: AbpEnumServiceProxy,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    super(injector);
    this.refresh();
  }

  exportData() {
    this.api.getAll().subscribe((k) => {
      const json = JSON.stringify(k, null, 2);
      downloadFileFromText(json, 'enums.json');
    });
  }
  importData(d) {
    this.loading++;
    if (d.type === 'json') {
      const data = JSON.parse(d.data);
      console.log(data);
      this.api.import(data).subscribe(
        (k) => {
          this.loading--;
          this.logger.Success(this.translate.instant('AbpDz::Success'));
          this.refresh();
        },
        (e) => this.asyncError(e)
      );
    }
  }
  createOrUpdate(item: AbpEnum): void {
    const dialogRef = this.dialog.open(EnumsDetailComponent, {
      width: '80vw',
      // height: '80vh',
      panelClass: ['overflow-auto', 'p-0'],
      data: {
        value: Object.assign({}, item),
        all: this.all,
        dictionary: this.dictionary,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        Object.assign(item, result);
        console.log(result);
        this.current = result;
        if (this.operation === CrudOperation.Create) {
          if (this.currentType && item.parrentId != null) {
            if (this.currentType.childs == null) {
              this.currentType.childs = [];
            }
            this.currentType.childs.push(item);
            this.dataSource.setData(this.currentType.childs);
          } else {
            this.types.push(item);
            this.currentType = item;
          }
        }
        this.dictionary[item.id] = item;
        this.cd.markForCheck();
      }
    });
  }
  applyFilter(v?) {}
  private refresh() {
    this.loading++;
    this.api.getAll().subscribe(
      (k) => {
        this.loading--;
        this.all = k;
        this.setTypes(k);
      },
      (e) => this.asyncError(e)
    );
  }
  delete(item: AbpEnum, array: AbpEnum[]) {
    if (confirm(this.translate.instant('AbpDz::ConfirmDelete'))) {
      this.loading++;
      this.api.delete(item.id).subscribe(
        () => {
          array.splice(array.indexOf(item), 1);
          this.dataSource.setData(array);
          this.cd.markForCheck();
          this.loading--;
        },
        (e) => this.asyncError(e)
      );
    }
  }
  create(t?: AbpEnum) {
    this.operation = CrudOperation.Create;
    this.currentType = t;
    this.createOrUpdate({
      id: 0,
      parrentId: t?.id,
      entityType: t?.entityType || 'text',
    });
  }
  update(e) {
    this.operation = CrudOperation.Update;
    this.createOrUpdate(e);
  }

  private setTypes(k: AbpEnum[]) {
    const v = {};
    this.dictionary = v;
    k.forEach((z) => {
      z.childs = [];
      v[z.id] = z;
    });
    k.forEach((z) => {
      if (z.parrentId) {
        v[z.parrentId].childs.push(z);
      }
    });
    this.types = k.filter((e) => e.parrentId == null);
    this.setCurrentType(this.types[0]);
  }
  setCurrentType(item) {
    this.currentType = item;
    if (this.currentType) {
      if (this.currentType.childs == null) {
        this.currentType.childs = [];
      }
      this.dataSource.setData(this.currentType.childs);
    } else {
      this.dataSource.setData([]);
    }
  }
}
