import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionManagementComponent } from './components/permission-management.component';
import { ThemeSharedModule } from '@abpdz/ng.theme.shared';
import { CoreModule } from '@abpdz/ng.core';
import { PermissionManagementService } from './services/permission-management.service';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [PermissionManagementComponent],
  imports: [CommonModule, CoreModule, ThemeSharedModule, MatBadgeModule],
  entryComponents: [PermissionManagementComponent],
  providers: [PermissionManagementService],
})
export class PermissionManagementModule {}
