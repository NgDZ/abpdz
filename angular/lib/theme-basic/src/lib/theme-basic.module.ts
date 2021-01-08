import { CoreModule } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { ToastrModule } from 'ngx-toastr';
import { ApplicationLayoutComponent } from './components/application-layout/application-layout.component';
import { ValidationErrorComponent } from './components/validation-error.component';

const components = [ApplicationLayoutComponent, ValidationErrorComponent];
@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    ThemeSharedModule,
    ToastrModule.forRoot(),
    NgxValidateCoreModule.forRoot({
      blueprints: {
        creditCard: 'AbpValidation::ThisFieldIsNotAValidCreditCardNumber.',
        email: 'AbpValidation::ThisFieldIsNotAValidEmailAddress.',
        invalid: 'AbpValidation::ThisFieldIsNotValid.',
        max:
          'AbpValidation::ThisFieldMustBeBetween{0}And{1}[{{ min }},{{ max }}]',
        maxlength:
          'AbpValidation::ThisFieldMustBeAStringOrArrayTypeWithAMaximumLengthOf{0}[{{ requiredLength }}]',
        min:
          'AbpValidation::ThisFieldMustBeBetween{0}And{1}[{{ min }},{{ max }}]',
        minlength:
          'AbpValidation::ThisFieldMustBeAStringOrArrayTypeWithAMinimumLengthOf{0}[{{ requiredLength }}]',
        ngbDate: 'AbpValidation::ThisFieldIsNotValid.',
        passwordMismatch: 'AbpIdentity::Identity.PasswordConfirmationFailed',
        range:
          'AbpValidation::ThisFieldMustBeBetween{0}And{1}[{{ min }},{{ max }}]',
        required: 'AbpValidation::ThisFieldIsRequired.',
        url:
          'AbpValidation::ThisFieldIsNotAValidFullyQualifiedHttpHttpsOrFtpUrl',
      },
      errorTemplate: ValidationErrorComponent,
    }),
  ],
  exports: [...components],
  providers: [],
})
export class BaseThemeBasicModule {}
@NgModule({
  exports: [BaseThemeBasicModule],
  imports: [],
})
export class RootThemeBasicModule {
  constructor() {}
}

@NgModule({
  exports: [BaseThemeBasicModule],
  imports: [BaseThemeBasicModule],
  providers: [],
})
export class ThemeBasicModule {
  static forRoot(): ModuleWithProviders<RootThemeBasicModule> {
    return {
      ngModule: RootThemeBasicModule,
      providers: [],
    };
  }
}
