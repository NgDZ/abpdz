import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'abpdz-image',
  templateUrl: './abpdz-image.component.html',
  styleUrls: ['./abpdz-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => NgdzImageComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgdzImageComponent),
      multi: true,
    },
  ],
})
export class NgdzImageComponent
  implements
    OnInit,
    ControlValueAccessor,
    OnChanges,
    MatFormFieldControl<string>,
    OnDestroy {
  ngOnDestroy(): void {}
  // tslint:disable:member-ordering
  stateChanges: Observable<void>;
  id: string;
  @Input()
  placeholder: string;
  ngControl: NgControl;
  focused = false;
  empty: boolean;
  shouldLabelFloat = true;
  required: boolean;
  errorState = false;
  controlType: 'ngdz-time-picker';
  autofilled = true;
  setDescribedByIds(ids: string[]): void {}
  onContainerClick(event: MouseEvent): void {}
  mouseIn = false;
  @ViewChild('fileLoader', { static: true })
  fileLoader: ElementRef;
  OnTouched: (v) => any;
  OnChange: (v) => any;
  disabled = false;
  @Input()
  parrentId;
  @Input()
  maxHeight = 800;
  @Input()
  maxWidth = 1280;
  @Input()
  minHeight = 64;
  @Input()
  minWidth = 64;
  @Input()
  maxHeightServer;
  @Input()
  maxWidthServer;

  @Input()
  readOnly = false;

  @Input()
  uploadUrl = '/api/AbpAssets/UploadFile/';
  @Input()
  downloaUrl = '{value}';
  @Input()
  valueResultFeild = 'location';
  currentUrl: string;
  data: { type: string; data: unknown; filename: any };
  loading = 0;
  fileToUpload: any;
  @Output()
  valueChange = new EventEmitter<any>();
  public get value(): string {
    return this._value;
  }
  private _value: string;
  @Input()
  public set value(v: string) {
    const isChanged = v !== this._value;
    this._value = v;
    if (v == null) {
      this.currentUrl = null;
    } else {
      let k = this.downloaUrl;
      k = k.replace('{value}', v);
      this.currentUrl = k;
    }
    if (isChanged) {
      this.valueChange.next(v);
      if (this.OnChange != null) {
        this.OnChange(v);
      }
    }
  }
  pickFile() {
    (<any>this.fileLoader.nativeElement).click();
    // this._elementRef.nativeElement.querySelector('input').click();
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.fileToUpload = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.currentUrl = event.target.result;
        setTimeout(() => {
          this.cd.markForCheck();
        }, 300);
      };
    }
  }

  upload() {
    this.loading++;
    const formData = new FormData();
    const file: File = this.fileToUpload;

    formData.append('file', file);

    // const data = {
    if (this.value != null) {
      formData.append('id', JSON.stringify(this.value));
    }

    if (this.parrentId != null) {
      formData.append('parrentId', JSON.stringify(this.parrentId));
    }
    if (this.maxWidthServer != null) {
      formData.append('maxWidth', JSON.stringify(this.maxWidthServer));
    }
    if (this.maxHeightServer != null) {
      formData.append('maxHeight', JSON.stringify(this.maxHeightServer));
    }
    //   numberLocation: ns,
    //   MustHaveStamp: this.HasStamp,
    //   regEx: this.Regx
    // };
    // formData.append('data', JSON.stringify(data));

    // const req = new HttpRequest('POST', this.uploadUrl, formData, {});

    // this.http.request(req).subscribe(event => {
    //   this.busy--;
    //   this.cd.markForCheck();
    // });
    // const header = localStorage.get('access_token') ? { headers: { au: 'Bearer ' + localStorage.get('access_token') } } : null;
    this.cd.markForCheck();
    this.http.post(this.uploadUrl, formData).subscribe(
      (v) => {
        this.loading--;
        if (v != null) {
          console.log(v);
          if (this.valueResultFeild != null) {
            this.value = <any>v[this.valueResultFeild];
          } else {
            this.value = <any>v;
          }
        }
        this.cleanImportFile();

        this.cd.markForCheck();
      },
      (e) => {
        this.loading--;
        this.logger.asyncError(e);
      }
    );
  }

  cleanImportFile() {
    this.fileToUpload = null;
    (<any>this.fileLoader.nativeElement).value = null;
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private logger: LoggerService
  ) {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.OnChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.OnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value = this._value;
  }
}
