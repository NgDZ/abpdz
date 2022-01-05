import {
  SubSink,
  AuthService,
  LocalizationService,
  AbpFacade,
  emailValidator,
  matchingPasswords,
} from '@abpdz/ng.core';
import { LoggerService, getPasswordValidators } from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  isDevMode,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  public registerForm: FormGroup;
  public hide = true;
  public userType = 1;
  public userTypes = [
    { id: 1, name: 'Guide' },
    { id: 2, name: 'Traveler' },
    // { id: 3, name: 'Buyer' },
  ];
  error: any;
  loading: number;
  constructor(
    public fb: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public http: HttpClient,
    private route: ActivatedRoute,
    public cd: ChangeDetectorRef,
    public logger: LoggerService,
    public auth: AuthService,
    public translate: LocalizationService,
    private facade: AbpFacade,
    public snackBar: MatSnackBar
  ) {
    this.subs.push(
      this.activatedRoute.params.subscribe((params) => {
        console.log(params);
        this.userType = params['type']?.toLowerCase() == 'guide' ? 1 : 2;
      })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  validateAsync(id: 'PhoneExists' | 'UserOrMailExists' | 'emailExists') {
    return (control: AbstractControl) => {
      return this.http
        .get<boolean>('/api/Account/' + id + '?value=' + control.value)
        .pipe(
          map((res) => {
            return res ? { taken: true } : null;
          })
        );
    };
  }
  ngOnInit() {
    const passwordValidations = getPasswordValidators({
      'Abp.Identity.Password.EnableReset': 'true',
      'Abp.Identity.Password.RequiredLength': '6',
      'Abp.Identity.Password.RequiredUniqueChars': '1',
      'Abp.Identity.Password.RequireNonAlphanumeric': 'True',
      'Abp.Identity.Password.RequireLowercase': 'True',
      'Abp.Identity.Password.RequireUppercase': 'True',
      'Abp.Identity.Password.RequireDigit': 'True',
    });
    this.registerForm = this.fb.group(
      {
        // userType: ['', Validators.required],
        // username: [
        //   '',
        //   Validators.compose([Validators.required, Validators.minLength(5)]),
        //   this.validateAsync('UserOrMailExists').bind(this),
        // ],
        email: [
          '',
          Validators.compose([Validators.required, emailValidator]),
          this.validateAsync('UserOrMailExists').bind(this),
          ,
        ],
        password: ['', [Validators.required, ...passwordValidations]],
        phone: [
          '',
          Validators.compose([Validators.required]),
          this.validateAsync('PhoneExists').bind(this),
        ],
        confirmPassword: ['', Validators.required],
        receiveNewsletter: false,
      },
      { validator: matchingPasswords('password', 'confirmPassword') }
    );
    if (isDevMode()) {
      this.registerForm.patchValue({
        email: 'u@gmail.com',
        password: '1q2w3E*',
        phone: '060000005852',
        confirmPassword: '1q2w3E*',
        receiveNewsletter: true,
      });
    }
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      {
        this.error = null;
        this.registerForm.disable();
        this.loading = 1;
        var val = { ...this.registerForm.value };
        val.username = val.email;
        val.userType = this.userType;
        this.auth.registerData(val).subscribe(
          (k) => {
            this.loading = 0;
            this.logger.Success(this.translate.instant('AbpAccount::Register'));

            this.auth.getNewToken(val as any).subscribe(
              (k) => {
                const rUr = this.route.snapshot.queryParams.redirectUrl;
                this.router.navigate([rUr || '/']);
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
            this.registerForm.enable();
            this.error = e?.error;
            console.error(this.error);
            this.cd.markForCheck();
          }
        );
      }
    }
  }
}
