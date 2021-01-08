import {
  ProfileService,
  selectCurrentUser,
  updateCurrentUser,
} from '@abpdz/ng.core';
import { ToasterService } from '@abpdz/ng.theme.shared';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize, tap } from 'rxjs/operators';
import { Account } from '../../models/account';

const { maxLength, required, email } = Validators;

@Component({
  selector: 'abp-personal-settings-form',
  templateUrl: './personal-settings.component.html',
  exportAs: 'abpPersonalSettingsForm',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalSettingsComponent
  implements
    OnInit,
    Account.PersonalSettingsComponentInputs,
    Account.PersonalSettingsComponentOutputs {
  form: FormGroup;

  inProgress: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private profileService: ProfileService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const profile = this.store
      .select(selectCurrentUser)
      .subscribe((profile) => {
        this.form = this.fb.group({
          userName: [profile.userName, [required, maxLength(256)]],
          email: [profile.email, [required, email, maxLength(256)]],
          name: [profile.name || '', [maxLength(64)]],
          surname: [profile.surName || '', [maxLength(64)]],
          phoneNumber: [profile.phoneNumber || '', [maxLength(16)]],
        });
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.inProgress = true;
    this.profileService
      .update({
        ...this.form.value,
        extraProperties: {},
        isExternal: true,
        hasPassword: true,
      })
      .pipe(
        tap((data) => {
          this.store.dispatch(updateCurrentUser({ data }));
        }),
        finalize(() => (this.inProgress = false))
      )
      .subscribe(() => {
        this.toasterService.success(
          'AbpAccount::PersonalSettingsSaved',
          'Success',
          { life: 5000 }
        );
      });
  }
}
