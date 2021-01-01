import { CoreModule } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialRootComponent } from './components';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { QuickPanelComponent } from './components/layout/quick-panel/quick-panel.component';
import { ToolbarComponent } from './components/layout/toolbar/toolbar.component';
import { MaterialApplicationLayoutComponent } from './components/material-application-layout/material-application-layout.component';
const components = [
  MaterialRootComponent,
  FooterComponent,
  NavbarComponent,
  QuickPanelComponent,
  ToolbarComponent,
  MaterialApplicationLayoutComponent,
];
@NgModule({
  declarations: [...components],
  imports: [CommonModule, RouterModule, CoreModule, ThemeSharedModule],
  exports: [...components],
  providers: [],
})
export class BaseThemeMaterialModule {}
@NgModule({
  exports: [BaseThemeMaterialModule],
  imports: [],
})
export class RootThemeMaterialModule {
  constructor() {}
}

@NgModule({
  exports: [BaseThemeMaterialModule],
  imports: [BaseThemeMaterialModule],
  providers: [],
})
export class ThemeMaterialModule {
  static forRoot(): ModuleWithProviders<RootThemeMaterialModule> {
    return {
      ngModule: RootThemeMaterialModule,
      providers: [],
    };
  }
}
