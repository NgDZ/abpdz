import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormGroup,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'abp-string-json-form',
  template: `
    <formly-form
      *ngIf="fields != null"
      [options]="options"
      [form]="form"
      [fields]="fields"
      [model]="model"
    >
    </formly-form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StringJsonFormComponent),
      multi: true,
    },
  ],
})
export class StringJsonFormComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  private _value: string;
  public get value(): string {
    return this._value;
  }
  changeFnc: any;
  disabled: boolean = false;
  @Input()
  public set value(v: string) {
    this._value = v;
    if (this.oldVal != v) {
      this.oldVal = v;
      try {
        this.model = JSON.parse(v || '{}');
      } catch (error) {
        console.error(error);
        this.model = {};
      }
    }
  }

  sub: Subscription;
  @Output()
  valueChange = new EventEmitter<string>();

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  oldVal = null;
  oldModel = {};
  model = {};

  @Input()
  fields: FormlyFieldConfig[];
  constructor(private cd: ChangeDetectorRef) {}
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.changeFnc = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.sub = this.form.valueChanges.subscribe((v) => {
      this.oldVal = JSON.stringify(v);
      this._value = this.oldVal;
      if (this.changeFnc) {
        this.changeFnc(this._value);
      }
      this.valueChange.emit(this.oldVal);
    });
  }
}
