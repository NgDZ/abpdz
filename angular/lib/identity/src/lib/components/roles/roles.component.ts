import { PermissionManagementService } from '@abpdz/ng.permission-management';
import {
  BaseCrudComponent,
  AbpIOHttpService,
  RestDataSource,
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { abpAnimations } from '@abpdz/ng.theme.shared';
import { Observable, of } from 'rxjs';
import {
  IdentityRoleCreateOrUpdateDtoBase,
  IdentityUserService,
} from '../../proxy/identity';
import { DataConfigService, RoleAdminMenuKey } from '@abpdz/ng.core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: [],

  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent
  extends BaseCrudComponent<any>
  implements OnInit, AfterViewInit {
  lookups: { permissions: any[]; permissionsNames: string[] } = {
    permissions: [],
    permissionsNames: [],
  };
  userRoleMenu = [];
  filter;
  constructor(
    injector: Injector,
    private httpClient: HttpClient,
    private identityService: IdentityUserService,
    private permissionManagementService: PermissionManagementService,
    private data: DataConfigService,
    private fb: FormBuilder
  ) {
    super(injector);
    this.displayedColumns = ['Actions', 'name'];

    this.editForm = this.fb.group({
      id: [],
      name: [Validators.required, Validators.maxLength(256)],

      isDefault: [false],
      isPublic: [false],
    });
  }

  search() {
    this.dataSource.filter.next({ filter: this.filter });
  }
  openPermissionsModal(id) {
    this.permissionManagementService.managePermissions({
      providerName: 'R',
      providerKey: id,
      hideBadges: true,
    });
  }

  ngOnInit() {
    // this.api.getAllPermissions().subscribe(v => {
    //   this.lookups.permissions = v.items;
    //   this.lookups.permissionsNames = v.items.map(z => z.name);
    // });

    this.dataSource = new RestDataSource(
      new AbpIOHttpService(this.httpClient, '/api/identity/roles')
    );
    this.dataSource.setServices(this.logger, this.translate);

    this.dataSource.initCreate$ = (h) => {
      return of({
        isDefault: false,
        isPublic: true,
        name: '',
        extraProperties: {},
      });
    };
    this.userRoleMenu = this.data.getList(RoleAdminMenuKey);
  }
  ngAfterViewInit() {}
}
