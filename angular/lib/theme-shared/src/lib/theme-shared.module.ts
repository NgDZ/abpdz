import { CoreModule, LocaleValue } from '@abpdz/ng.core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  APP_INITIALIZER,
  Inject,
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
} from '@angular/core';

// import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StoreModule } from '@ngrx/store';
import { themeFeatureKey, themeReducer } from './ngrx/theme.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ThemeEffects } from './ngrx/theme.effects';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatFormFieldDefaultOptions,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  NgdzImageComponent,
  NgdzImportButtonComponent,
  NgdzSelectColumnsComponent,
  NgSelectFormFieldControlDirective,
  NotificationComponent,
  ObjectPropertiesComponent,
} from './components';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { RouterModule } from '@angular/router';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};
const components = [
  NotificationComponent,
  NgdzImportButtonComponent,
  NgdzImageComponent,
  NgdzSelectColumnsComponent,
  NgSelectFormFieldControlDirective,
  ObjectPropertiesComponent,
  TimeAgoPipe,
];
const declarationsWithExports = [
  MatDialogModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatExpansionModule,
  MatSidenavModule,
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
  MatButtonModule,
  BidiModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  LayoutModule,
  MatBadgeModule,
  MatTabsModule,
  DragDropModule,
  MatProgressSpinnerModule,
  // flex
  FlexLayoutModule,

  // cdk
  OverlayModule,
  // fuse
  // Fuse modules
];
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root',
})
export class AbpdzNativeDateAdapter extends NativeDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string,
    platform: Platform
  ) {
    super(matDateLocale, platform);
  }
}
@NgModule({
  declarations: [...components],
  exports: [...declarationsWithExports, ...components],
  imports: [...declarationsWithExports, CommonModule, CoreModule, RouterModule],

  providers: [DatePipe],
})
export class BaseThemeSharedModule {}

@NgModule({
  exports: [BaseThemeSharedModule],
  imports: [],
})
export class RootThemeSharedModule {}
@NgModule({
  exports: [BaseThemeSharedModule],
  imports: [
    BaseThemeSharedModule,

    StoreModule.forFeature(themeFeatureKey, themeReducer),
    EffectsModule.forFeature([ThemeEffects]),
  ],
  declarations: [],
  entryComponents: [],
  providers: [
    { provide: DateAdapter, useExisting: AbpdzNativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    {
      provide: MAT_DATE_LOCALE,
      deps: [LocaleValue], //some service handling global settings
      useFactory: (r) => r.getLocale(), //returns locale string
    },
  ],
})
export class ThemeSharedModule {
  constructor() {}

  static forRoot(options = {}): ModuleWithProviders<RootThemeSharedModule> {
    return {
      ngModule: RootThemeSharedModule,
      providers: [
        // {
        //   provide: APP_INITIALIZER,
        //   multi: true,
        //   deps: [THEME_SHARED_APPEND_CONTENT],
        //   useFactory: noop,
        // },
        {
          provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
          useValue: appearance,
        },
      ],
    };
  }
}
