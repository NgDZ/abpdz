import { DynamicLayoutComponent, PermissionGuard } from '@abpdz/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnumsListComponent } from './enums-list/enums-list.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
    canActivate: [PermissionGuard],
    children: [
      {
        path: 'config',
        canActivate: [PermissionGuard],
        data: {
          requiredPolicy: 'ABPDZ.Enums',
        },
        component: EnumsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnumsRoutingModule {}
