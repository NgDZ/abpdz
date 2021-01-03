import { BaseAsyncComponent } from '@abpdz/ng.theme.shared';
import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionManagementComponent } from '../components/permission-management.component';

@Injectable({
  providedIn: 'root',
})
export class PermissionManagementService {
  constructor(public dialog: MatDialog) {}

  managePermissions(data: {
    providerName: string;
    providerKey: string;
    visible?: boolean;
    hideBadges?: boolean;
  }): void {
    const dialogRef = this.dialog.open(PermissionManagementComponent, {
      width: '80vw',
      minWidth: '80vw',
      data,
      panelClass: 'p-0',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
