import { PermissionManagementService } from '@abpdz/ng.permission-management';
import {
  RestMaterialTableComponent,
  AbpIOHttpService,
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { abpAnimations } from '@abpdz/ng.theme.shared';
import { Observable, of } from 'rxjs';
import {
  IdentityRoleCreateOrUpdateDtoBase,
  IdentityUserService,
} from '../../proxy/identity';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: [],

  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent
  extends RestMaterialTableComponent<any>
  implements OnInit, AfterViewInit {
  lookups: { permissions: any[]; permissionsNames: string[] } = {
    permissions: [],
    permissionsNames: [],
  };

  constructor(
    injector: Injector,
    httpClient: HttpClient,
    private identityService: IdentityUserService,
    private permissionManagementService: PermissionManagementService,
    private fb: FormBuilder
  ) {
    super(new AbpIOHttpService(httpClient, '/api/identity/roles'), injector);
    this.displayedColumns = ['Actions', 'name'];

    this.editForm = this.fb.group({
      id: [],
      name: [Validators.required, Validators.maxLength(256)],

      isDefault: [false],
      isPublic: [false],
    });
  }
  openPermissionsModal(id) {
    this.permissionManagementService.managePermissions({
      providerName: 'R',
      providerKey: id,
      hideBadges: true,
    });
  }
  newObject(): Observable<Partial<IdentityRoleCreateOrUpdateDtoBase>> {
    return of({
      isDefault: false,
      isPublic: true,
      extraProperties: {},
    });
  }
  ngOnInit() {
    // this.api.getAllPermissions().subscribe(v => {
    //   this.lookups.permissions = v.items;
    //   this.lookups.permissionsNames = v.items.map(z => z.name);
    // });
    this.prepareComponent();
  }
  ngAfterViewInit() {}
}
