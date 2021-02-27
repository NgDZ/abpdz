import { PermissionGuard, AuthGuard } from '@abpdz/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuditLogComponent,
  IdentitySecurityLogComponent,
  NotificationsHistoryComponent,
} from './pages';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'log',
    component: AuditLogComponent,
    data: {
      requiredPolicy: 'AbpIdentity.Users',
    },
  },
  {
    canActivate: [AuthGuard],
    path: 'identity',
    component: IdentitySecurityLogComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'nothistory',
    component: NotificationsHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbpDzAuditRoutingModule {}
