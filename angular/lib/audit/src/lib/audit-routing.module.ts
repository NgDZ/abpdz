import { PermissionGuard, AuthGuard } from '@abpdz/ng.core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogComponent, IdentitySecurityLogComponent } from './pages';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbpDzAuditRoutingModule {}
