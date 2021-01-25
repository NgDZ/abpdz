import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbpDzDemosRoutingModule } from './abp-dz-demos-routing.module';
import { CoreModule, LazyModuleFactory } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { PingsComponent } from './pages';
import { ModelConfigsComponent } from './pages/model-configs/model-configs.component';

@NgModule({
  declarations: [PingsComponent, ModelConfigsComponent],
  imports: [
    CommonModule,
    AbpDzDemosRoutingModule,
    CommonModule,
    ThemeSharedModule,
    CoreModule.forLazy(),
    NgxValidateCoreModule,
  ],
})
export class AbpDzDemosModule {
  static forChild(): ModuleWithProviders<AbpDzDemosModule> {
    return {
      ngModule: AbpDzDemosModule,
      providers: [],
    };
  }
  static forLazy(): NgModuleFactory<AbpDzDemosModule> {
    return new LazyModuleFactory(AbpDzDemosModule.forChild());
  }
}
