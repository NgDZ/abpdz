import { CoreModule } from '@abpdz/ng.core';
import { DatePipe } from '@angular/common';
import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule,
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

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};
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
  MatTabsModule,
  FlexLayoutModule,
  // fuse
  // Fuse modules
];

@NgModule({
  declarations: [],
  exports: [...declarationsWithExports],
  imports: [...declarationsWithExports],

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
  providers: [],
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
