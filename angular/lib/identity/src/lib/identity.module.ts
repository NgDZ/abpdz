import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';
import { CoreModule, LazyModuleFactory } from '@abpdz/ng.core';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PermissionManagementModule } from '@abpdz/ng.permission-management';

@NgModule({
  declarations: [UsersComponent, RolesComponent],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ThemeSharedModule,
    MatTableModule,
    PermissionManagementModule,
    MatPaginatorModule,
    CoreModule.forLazy(),
  ],
})
export class IdentityModule {
  static forChild(): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [],
    };
  }

  static forLazy(): NgModuleFactory<IdentityModule> {
    return new LazyModuleFactory(IdentityModule.forChild());
  }
}
