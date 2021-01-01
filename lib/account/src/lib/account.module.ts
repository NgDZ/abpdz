import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { RegisterComponent } from './components/register/register.component';
import { TenantBoxComponent } from './components/tenant-box/tenant-box.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';
import { Options } from './models/options';
import { InjectionToken } from '@angular/core';
import { AuthenticationFlowGuard } from './guards';
import { CoreModule, LazyModuleFactory } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
export const ACCOUNT_OPTIONS = new InjectionToken<Options>('ACCOUNT_OPTIONS');

export function accountOptionsFactory(options: Options) {
  return {
    redirectUrl: '/',
    ...options,
  };
}

@NgModule({
  declarations: [
    AuthWrapperComponent,
    ChangePasswordComponent,
    LoginComponent,
    PersonalSettingsComponent,
    RegisterComponent,
    TenantBoxComponent,
    ManageProfileComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ThemeSharedModule,
    CoreModule,
    NgxValidateCoreModule,
  ],
})
export class AccountModule {
  static forChild(options: Options): ModuleWithProviders<AccountModule> {
    return {
      ngModule: AccountModule,
      providers: [
        AuthenticationFlowGuard,
        { provide: ACCOUNT_OPTIONS, useValue: options },
        {
          provide: 'ACCOUNT_OPTIONS',
          useFactory: accountOptionsFactory,
          deps: [ACCOUNT_OPTIONS],
        },
      ],
    };
  }

  static forLazy(options: Options): NgModuleFactory<AccountModule> {
    return new LazyModuleFactory(AccountModule.forChild(options));
  }
}
