import {
  APP_INITIALIZER,
  Inject,
  Injectable,
  LOCALE_ID,
  ModuleWithProviders,
  NgModule,
  NgModuleFactory,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ABP } from './models/common';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClientXsrfModule,
} from '@angular/common/http';
import {
  AddCsrfHeaderInterceptorService,
  ApiInterceptor,
  MiniProfilerInterceptor,
} from './interceptors';
import { EffectsModule } from '@ngrx/effects';
import { AbpEffects, setEnvirement } from './ngrx';
import { Store, StoreModule } from '@ngrx/store';
import { abpFeatureKey, abpReducer } from './ngrx/abp.reducer';
import { coreOptionsFactory, CORE_OPTIONS } from './tokens';
import { noop } from './utils/common-utils';

// import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AbpDatePipe, LocalizationPipe } from './pipes';
import { DynamicLayoutComponent } from './components/dynamic-layout.component';
import { ReplaceableRouteContainerComponent } from './components/replaceable-route-container.component';
import { RouterOutletComponent } from './components/router-outlet.component';
import { RouterEffects } from './ngrx/router.effects';
import { PermissionDirective } from './directives/permission.directive';
import { LocaleValue } from './utils';
import { EnumsDisplayPipe, EnumsPipe } from './enums';
@NgModule({
  declarations: [
    LocalizationPipe,
    AbpDatePipe,
    EnumsPipe,
    EnumsDisplayPipe,
    PermissionDirective,
    DynamicLayoutComponent,
    ReplaceableRouteContainerComponent,
    RouterOutletComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // exported compoenents
    LocalizationPipe,
    AbpDatePipe,
    EnumsPipe,
    EnumsDisplayPipe,
    PermissionDirective,
    DynamicLayoutComponent,
    ReplaceableRouteContainerComponent,
    RouterOutletComponent,
  ],
  providers: [],
})
export class BaseCoreModule {}

@NgModule({
  exports: [BaseCoreModule],
  imports: [
    BaseCoreModule,
    EffectsModule.forRoot([AbpEffects, RouterEffects]),

    // OAuthModule.forRoot(),
    StoreModule.forFeature(abpFeatureKey, abpReducer),
  ],
})
export class RootCoreModule {}

@NgModule({
  exports: [BaseCoreModule],
  imports: [BaseCoreModule],
  providers: [],
})
export class CoreModule {
  static forLazy(): ModuleWithProviders<BaseCoreModule> {
    return {
      ngModule: BaseCoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: ApiInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: AddCsrfHeaderInterceptorService,
          multi: true,
        },

        {
          provide: HTTP_INTERCEPTORS,
          useExisting: MiniProfilerInterceptor,
          multi: true,
        },
        {
          provide: LOCALE_ID,
          deps: [LocaleValue], //some service handling global settings
          useFactory: (r) => r.getLocale(), //returns locale string
        },
      ],
    };
  }
  static forRoot(
    options = {} as ABP.Root
  ): ModuleWithProviders<RootCoreModule> {
    return {
      ngModule: RootCoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: ApiInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: AddCsrfHeaderInterceptorService,
          multi: true,
        },

        {
          provide: HTTP_INTERCEPTORS,
          useExisting: MiniProfilerInterceptor,
          multi: true,
        },
        {
          provide: LOCALE_ID,
          deps: [LocaleValue], //some service handling global settings
          useFactory: (r) => r.getLocale(), //returns locale string
        },
        {
          provide: 'CORE_OPTIONS',
          useValue: options,
        },
        {
          provide: CORE_OPTIONS,
          useFactory: coreOptionsFactory,
          deps: ['CORE_OPTIONS'],
        },
        // { provide: OAuthStorage, useFactory: storageFactory },
      ],
    };
  }
}
