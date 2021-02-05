import {
  AbpFacade,
  AuthService,
  ConfigStateService,
  selectAppReady,
} from '@abpdz/ng.core';
import {
  abpAnimations,
  BaseAsyncComponent,
  getPasswordValidators,
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { comparePasswords } from '@ngx-validate/core';
import { Observable, of } from 'rxjs';

const { required } = Validators;
const PASSWORD_FIELDS = ['newPassword', 'repeatNewPassword'];

@Component({
  selector: 'abp-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: abpAnimations,
})
export class ForgotPasswordComponent
  extends BaseAsyncComponent
  implements OnInit {
  error = null;
  inSendForm = true;
  code = null;
  sendForm: FormGroup;

  resetForm: FormGroup;
  currentMail: string = null;
  ready$: Observable<boolean>;

  constructor(
    private httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    injector: Injector,
    private store: Store,
    private auth: AuthService,
    private facade: AbpFacade,
    private route: ActivatedRoute,
    private configService: ConfigStateService,
    private router: Router
  ) {
    super(injector);
    this.ready$ = this.store.select(selectAppReady);

    this.code = this.route.snapshot.queryParams.code;
  }

  ngOnInit(): void {
    this.sendForm = this._formBuilder.group({
      username: ['', [Validators.required]],
    });

    const passwordValidations = getPasswordValidators(
      this.facade.abp?.conf?.setting?.values
    );
    this.resetForm = this._formBuilder.group(
      {
        code: ['', required],
        username: ['', required],
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
  }

  sendCode() {
    this.sendCodeValue(this.sendForm.value.username);
  }
  resendCode() {
    this.code = null;
    this.sendCodeValue(this.resetForm.value.username);
  }
  sendCodeValue(v) {
    this.loading = 1;
    (this.code == null
      ? this.auth.sendCode({
          username: v,
          resetPassword: true,
        })
      : of(null)
    ).subscribe(
      (k) => {
        this.loading = 0;

        this.error = null;
        this.inSendForm = false;
        if (this.code != null) {
          this.resetForm.patchValue({ code: v });
        }
        this.cd.markForCheck();
      },
      (e) => {
        this.loading = 0;
        this.error = 'AbpAccount::DefaultErrorMessage';
        this.cd.markForCheck();
      }
    );
  }

  login() {
    this.error = null;
    this.loading = 0;
    this.resetForm.disable();
    var val = { ...this.resetForm.value };
    this.auth.resetPassword(val).subscribe(
      (k) => {
        this.loading = 0;
        this.resetForm.enable();
        this.logger.Success(
          this.translate.instant('AbpAccount::PasswordChangedMessage')
        );
        var val = this.resetForm.value;
        this.auth
          .getNewToken({
            username: val.username,
            password: val.newPassword,
            '2F_CODE': val.code,
          } as any)
          .subscribe(
            (k) => {
              this.router.navigate(['/']);
              this.cd.markForCheck();
            },
            (e) => {
              this.auth.login('/');
            }
          );
        this.cd.markForCheck();
      },
      (e) => {
        this.loading = 0;
        this.resetForm.enable();
        this.error = e?.error;
        console.error(this.error);
        this.cd.markForCheck();
      }
    );
  }
}
