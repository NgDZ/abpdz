import { AuthService, selectAppReady } from '@abpdz/ng.core';
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
  loading = false;
  ready$: Observable<boolean>;
  error: null;
  constructor(
    private _formBuilder: FormBuilder,
    private store: Store,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ready$ = this.store.select(selectAppReady);

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
      password: ['', Validators.required],
      rememberMe: [],
    });
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
        this.error = e;
        this.cd.markForCheck();
      }
    );
  }
}
