import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnumsRoutingModule } from './enums-routing.module';
import { CoreModule, LazyModuleFactory } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EnumsDetailComponent } from './enums-detail/enums-detail.component';
import { EnumsListComponent } from './enums-list/enums-list.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [EnumsListComponent, EnumsDetailComponent],
  imports: [
    CommonModule,
    EnumsRoutingModule,
    CommonModule,
    ThemeSharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CoreModule.forLazy(),
    NgxValidateCoreModule,
  ],
})
export class EnumsModule {
  static forChild(): ModuleWithProviders<EnumsModule> {
    return {
      ngModule: EnumsModule,
      providers: [],
    };
  }
  static forLazy(): NgModuleFactory<EnumsModule> {
    return new LazyModuleFactory(EnumsModule.forChild());
  }
}
