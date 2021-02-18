import {
  Component,
  OnInit,
  Injector,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional,
} from '@angular/core';
import { AbpEnumServiceProxy } from '../enums.sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseAsyncComponent } from '@abpdz/ng.theme.shared';
import { AbpEnum, SessionStateService } from '@abpdz/ng.core';

@Component({
  selector: 'gsso-enums-detail',
  templateUrl: './enums-detail.component.html',
  styleUrls: ['./enums-detail.component.scss'],
})
export class EnumsDetailComponent
  extends BaseAsyncComponent
  implements OnChanges {
  types = [
    { label: 'Texte', value: 'text' },
    { label: 'Nombre', value: 'number' },
  ];
  extraProperties = {};
  cultures = [];
  editForm: FormGroup;
  @Output()
  valid = new EventEmitter<boolean>();

  @Input()
  value: AbpEnum;
  @Output()
  valueChange = new EventEmitter<AbpEnum>();

  constructor(
    injector: Injector,
    public api: AbpEnumServiceProxy,
    public fb: FormBuilder,
    private sessionState: SessionStateService,
    @Optional() public dialogRef: MatDialogRef<EnumsDetailComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { value: AbpEnum; all: AbpEnum[] }
  ) {
    super(injector);

    this.editForm = this.fb.group({
      id: [0],
      code: [],
      parrentId: [],
      entityType: [],
      display: [null, Validators.required],
      description: [],
      value: [],
      data: [],
      schema: [],
      isStatic: [false],
      abbreviation: [],
      url: [],
      isSelectable: [false],
    });
    this.editForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((k) => {
        this.valueChange.next(k);
        this.valid.next(this.editForm.valid);
      });
    if (this.data != null) {
      this.value = this.data.value;
      this.editForm.enable();
      this.editForm.patchValue(this.value);
      this.extraProperties = data.value.extraProperties || {};
    } else {
      this.editForm.disable();
    }
    this.subs.push(
      this.sessionState.languages$.subscribe((k) => {
        this.cultures = k || [];
      })
    );
  }
  close(): void {
    this.dialogRef.close();
  }
  save(val?) {
    this.loading++;
    val = val || this.editForm.value;
    val.extraProperties = this.extraProperties;
    val.concurrencyStamp = this.data?.value?.concurrencyStamp;
    this.api.createOrUpdate(val || this.editForm.value).subscribe(
      (k) => {
        this.loading--;
        // if (k.value === null || k.value === '') {
        //   if (k.code === null || k.code === '') {
        //     k.code = '' + k.id;
        //   }
        //   k.value = '' + k.id;
        //   this.data.value.concurrencyStamp = k.concurrencyStamp;
        //   this.save(k);
        //   return;
        // }
        this.dialogRef.close(k);
        this.logger.Success(this.translate.instant('AbpDz::SuccessfulSaving'));
      },
      (e) => this.asyncError(e)
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.value != null) {
      this.editForm.enable();
      this.editForm.reset(this.value);
    } else {
      this.editForm.reset();
      this.editForm.disable();
    }
  }
}
