import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbpDzAuditRoutingModule } from './audit-routing.module';
import { CoreModule, LazyModuleFactory } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { IdentitySecurityLogComponent } from './pages/identity-security-log/identity-security-log.component';
import { AuditLogComponent } from './pages/audit-log/audit-log.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotificationsHistoryComponent } from './pages/notifications-history/notifications-history.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    IdentitySecurityLogComponent,
    AuditLogComponent,
    NotificationsHistoryComponent,
  ],
  imports: [
    AbpDzAuditRoutingModule,
    CommonModule,
    ThemeSharedModule,
    MatSortModule,
    MatTableModule,
    MatDatepickerModule,
    MatPaginatorModule,
    CoreModule.forLazy(),
    NgxValidateCoreModule,
  ],
})
export class AbpDzAuditModule {
  static forChild(): ModuleWithProviders<AbpDzAuditModule> {
    return {
      ngModule: AbpDzAuditModule,
      providers: [],
    };
  }
  static forLazy(): NgModuleFactory<AbpDzAuditModule> {
    return new LazyModuleFactory(AbpDzAuditModule.forChild());
  }
}
