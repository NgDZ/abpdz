import { Subscription } from 'rxjs';
import { Input, EventEmitter, Output, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { zipObject, pickBy } from 'lodash-es';
import { debounceTime } from 'rxjs/operators';

@Component({
  template: '',
})
export class BaseFilterComponent<Type, Lookups> {
  subscriptions: Subscription[] = [];
  displayStrings: any = {};
  Columns: string[];
  Advanced = false;

  @Input()
  lookups: Lookups;

  @Output()
  Filter: EventEmitter<any> = new EventEmitter<any>();

  private _useFilter: boolean;

  public get useFilter(): boolean {
    return this._useFilter;
  }
  @Input()
  public set useFilter(v: boolean) {
    this._useFilter = v;
  }

  @Input()
  editForm: FormGroup;

  item: Partial<Type> = {};
  _isNotNull(v) {
    return v !== null && v !== undefined;
  }
  baseFilterInit() {
    this.Columns.push('$search');

    this.editForm = this.fb.group(zipObject(this.Columns));
    this.subscriptions.push(
      this.editForm.valueChanges.pipe(debounceTime(300)).subscribe((v) => {
        this.Filter.emit(pickBy(v, this._isNotNull));
      })
    );
  }
  reset() {
    this.item = {};
    this.editForm.reset();
  }
  constructor(protected fb: FormBuilder) {}
  unSubscribe() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
}
