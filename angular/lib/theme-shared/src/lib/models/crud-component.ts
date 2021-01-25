import {
  Directive,
  Injector,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AsyncDataSource, CrudOperation } from './async-datasource';
import { BaseAsyncComponent } from './base-async-component';
@Directive({})
export class BaseCrudComponent<datatype> extends BaseAsyncComponent {
  @ViewChild('editDialog', { static: true })
  template: TemplateRef<any>;
  displayedColumns = [];
  dataSource: AsyncDataSource<datatype> | null;
  editForm: FormGroup;
  dialogRef: MatDialogRef<any>;

  public get current(): datatype {
    return this.dataSource?.current?.value;
  }
  public set current(v: datatype) {
    this.dataSource?.current?.next(v);
  }
  public get currentAny(): any {
    return this.dataSource?.current?.value;
  }
  public set currentAny(v: any) {
    this.dataSource?.current?.next(v);
  }

  protected dialog: MatDialog = this.injector.get(MatDialog);
  // protected cd: ChangeDetectorRef = this.injector.get(ChangeDetectorRef);
  constructor(
    @Optional()
    injector: Injector
  ) {
    super(injector);
  }

  dialogEdit(entity: Partial<datatype>) {
    this.dataSource.current.next(entity as any);
    if (this.editForm != null) {
      console.log(entity);
      this.editForm.reset(entity);
    }
    this.dialogRef = this.dialog.open(this.template, {
      data: Object.assign({}, entity),
      panelClass: ['overflow-auto', 'p-0'],
      maxWidth: '90vw',
      disableClose: true,
    }); // , this.current
  }

  startEdit(entity: Partial<datatype>) {
    this.dataSource.initUpdate$(entity).subscribe((k) => {
      this.dataSource.operation = CrudOperation.Update;
      this.dialogEdit(k);
    });
  }

  createEdit(entity?: Partial<datatype>) {
    this.dataSource.initCreate$(entity).subscribe((k) => {
      this.dataSource.operation = CrudOperation.Create;
      this.dialogEdit(k);
    });
  }
  closeDialog() {
    if (this.dialogRef != null) {
      this.dialogRef.close();
    }
  }
  cancel() {
    this.dataSource.current.next(null);
    this.closeDialog();
  }

  canSave(): boolean {
    return this.editForm != null && this.editForm.valid;
  }
  save(item?, ignoreFormValue = false) {
    if (this.dataSource.operation == null) {
      return true;
    }
    if (ignoreFormValue == false) {
      if (item == null) {
        item = this.dataSource.current.value || {};
      }

      item = { ...item, ...(this.editForm ? this.editForm.value : {}) };
    }
    let result: Observable<any>;
    switch (this.dataSource.operation) {
      case CrudOperation.Create:
        result = this.dataSource.create$(item);
        break;
      case CrudOperation.Update:
        result = this.dataSource.update$(item);
        break;
      case CrudOperation.Delete:
        result = this.dataSource.delete$(item);
        break;
    }
    if (result) {
      result.subscribe((k) => {
        if (this.dialogRef) {
          this.dialogRef.close(item);
        }
        this.dialogRef = null;
      });
    }
  }
}
