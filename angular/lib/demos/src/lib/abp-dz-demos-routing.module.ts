import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PingsComponent } from './pages';

const routes: Routes = [{ path: 'pings', component: PingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbpDzDemosRoutingModule {}
