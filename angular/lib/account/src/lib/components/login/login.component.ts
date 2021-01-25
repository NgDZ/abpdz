import {
  AuthService,
  ConfigStateService,
  selectAppReady,
} from '@abpdz/ng.core';
import { abpAnimations } from '@abpdz/ng.theme.shared';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  codeForm: FormGroup;
  loading = false;
  get twoFactor() {
    return (
      this.configService.getSettingValue('Abp.Identity.TwoFactor.Behaviour') ==
      'Forced'
    );
  }
  twoFactorCodeSended = false;
  ready$: Observable<boolean>;
  error = null;
  constructor(
    private _formBuilder: FormBuilder,
    private store: Store,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private configService: ConfigStateService,
    private router: Router
  ) {
    this.ready$ = this.store.select(selectAppReady);
    console.log(
      this.configService.getSettingValue('Abp.Identity.TwoFactor.Behaviour')
    );

    const rUr = this.route.snapshot.queryParams.redirectUrl;
    if (rUr == null) {
      this.router.navigate([], {
        relativeTo: route,
        queryParams: { redirectUrl: '/' },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      '2F_CODE': ['', this.twoFactor ? [Validators.required] : []],
      rememberMe: [],
    });

    this.codeForm = this._formBuilder.group({
      username: ['', [Validators.required]],
    });
  }
  sendCode() {
    this.sendCodeValue(this.codeForm.value.username);
  }
  resendCode() {
    this.sendCodeValue(this.loginForm.value.username);
  }
  sendCodeValue(v) {
    this.loading = true;
    this.auth
      .sendCode({
        username: v,
      })
      .subscribe(
        (k) => {
          this.loading = false;
          this.twoFactorCodeSended = true;
          this.error = null;
          this.loginForm.patchValue({ username: v });
          this.cd.markForCheck();
        },
        (e) => {
          this.loading = false;
          this.error = 'AbpAccount::DefaultErrorMessage';
          this.cd.markForCheck();
        }
      );
  }
  login() {
    this.error = null;
    this.loading = true;
    this.loginForm.disable();
    this.auth.getNewToken({ ...this.loginForm.value }).subscribe(
      (k) => {
        this.loading = false;
        this.loginForm.enable();
        this.cd.markForCheck();
      },
      (e) => {
        this.loading = false;
        this.loginForm.enable();
        this.error = e?.error;
        console.log(this.error);
        this.cd.markForCheck();
      }
    );
  }
}
