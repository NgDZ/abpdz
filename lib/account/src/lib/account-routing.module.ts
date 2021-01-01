import { AuthGuard } from '@abpdz/ng.core';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'manage-profile',
    component: ManageProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ThemeSharedModule],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
