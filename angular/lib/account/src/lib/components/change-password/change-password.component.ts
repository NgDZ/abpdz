import { AbpFacade, ProfileService } from '@abpdz/ng.core';
import { getPasswordValidators, ToasterService } from '@abpdz/ng.theme.shared';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { comparePasswords, Validation } from '@ngx-validate/core';

import { finalize } from 'rxjs/operators';
import { Account } from '../../models/account';

const { required } = Validators;

const PASSWORD_FIELDS = ['newPassword', 'repeatNewPassword'];

@Component({
  selector: 'abp-change-password-form',
  templateUrl: './change-password.component.html',
  exportAs: 'abpChangePasswordForm',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent
  implements
    OnInit,
    Account.ChangePasswordComponentInputs,
    Account.ChangePasswordComponentOutputs {
  form: FormGroup;

  inProgress: boolean;

  hideCurrentPassword: boolean = false;

  mapErrorsFn: Validation.MapErrorsFn = (errors, groupErrors, control) => {
    if (PASSWORD_FIELDS.indexOf(String(control.name)) < 0) {
      return errors;
    }

    return errors.concat(
      groupErrors.filter(({ key }) => key === 'passwordMismatch')
    );
  };

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private profileService: ProfileService,
    private facade: AbpFacade,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    const passwordValidations = getPasswordValidators(
      this.facade.abp?.conf?.setting?.values
    );

    this.form = this.fb.group(
      {
        password: ['', required],
        newPassword: [
          '',
          {
            validators: [required, ...passwordValidations],
          },
        ],
        repeatNewPassword: [
          '',
          {
            validators: [required, ...passwordValidations],
          },
        ],
      },
      {
        validators: [comparePasswords(PASSWORD_FIELDS)],
      }
    );

    if (this.hideCurrentPassword) {
      this.form.removeControl('password');
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.inProgress = true;
    this.profileService
      .changePassword({
        ...(!this.hideCurrentPassword && {
          currentPassword: this.form.get('password').value,
        }),
        newPassword: this.form.get('newPassword').value,
      })

      .pipe(finalize(() => (this.inProgress = false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.toasterService.success(
            'AbpAccount::PasswordChangedMessage',
            '',
            {
              life: 5000,
            }
          );

          if (this.hideCurrentPassword) {
            this.hideCurrentPassword = false;
            this.form.addControl('password', new FormControl('', [required]));
          }
        },
        error: (err) => {
          this.toasterService.error(
            err.error.error.message,
            'AbpAccount::DefaultErrorMessage'
          );
        },
      });
  }
}
