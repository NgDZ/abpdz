import {
  AuthGuard,
  DynamicLayoutComponent,
  PermissionGuard,
} from '@abpdz/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent, RolesComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: 'roles', pathMatch: 'full' },
  {
    path: '',
    component: DynamicLayoutComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          requiredPolicy: 'AbpIdentity.Roles',
        },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          requiredPolicy: 'AbpIdentity.Users',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityRoutingModule {}
