import { startLoadingAbpApplicationData } from '@abpdz/ng.core';
import { BaseAsyncComponent } from '@abpdz/ng.theme.shared';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnInit,
  Optional,
  TrackByFunction,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, map, switchMap, take } from 'rxjs/operators';
import { PermissionManagement } from '../models/permission-management';
import {
  PermissionGrantInfoDto,
  PermissionGroupDto,
  ProviderInfoDto,
} from '../proxy/models';
import { PermissionsService } from '../proxy/permissions.service';

type PermissionWithStyle = PermissionGrantInfoDto & {
  style: string;
};
@Component({
  selector: 'abp-permission-management',
  templateUrl: './permission-management.component.html',
  styles: [
    `
      :host {
        max-height: 100vh;
        overflow-y: auto;
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionManagementComponent
  extends BaseAsyncComponent
  implements OnInit {
  @Input()
  readonly providerName: string;

  @Input()
  readonly providerKey: string;

  @Input()
  readonly hideBadges = false;

  protected _visible = false;

  permissions: PermissionGrantInfoDto[] = [];
  groups$ = new BehaviorSubject<PermissionGroupDto[]>([]);
  selectedGroup: PermissionGroupDto;
  entityName = new BehaviorSubject<string>('');

  @Input()
  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    if (value === this._visible) {
      return;
    }
  }

  selectThisTab = false;
  selectThisTabIntermediate = false;

  selectAllTab = false;

  trackByFn: TrackByFunction<PermissionGroupDto> = (_, item) => item.name;

  get selectedGroupPermissions$(): Observable<PermissionWithStyle[]> {
    const margin = `margin-${
      document.body.dir === 'rtl' ? 'right' : 'left'
    }.px`;

    return this.groups$.pipe(
      map((groups) =>
        this.selectedGroup
          ? groups.find((group) => group.name === this.selectedGroup.name)
              .permissions
          : []
      ),
      map<PermissionGrantInfoDto[], PermissionWithStyle[]>((permissions) =>
        permissions.map(
          (permission) =>
            (({
              ...permission,
              style: { [margin]: findMargin(permissions, permission) },
              isGranted: this.permissions.find(
                (per) => per.name === permission.name
              )?.isGranted,
            } as any) as PermissionWithStyle)
        )
      )
    );
  }

  constructor(
    private store: Store,
    @Optional() public dialogRef: MatDialogRef<PermissionManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionsService: PermissionsService,
    injector: Injector
  ) {
    super(injector);
    if (this.data) {
      this.providerName = this.data?.providerName;
      this.providerKey = this.data?.providerKey;
      this.hideBadges = this.data?.hideBadges;
      this.reload();
    }
  }
  reload() {
    this.loading++;
    this.permissionsService
      .get(this.providerName, this.providerKey)
      .subscribe((k) => {
        this.groups$.next(k.groups);
        this.entityName.next(k.entityDisplayName);

        this.selectedGroup = k.groups[0];
        this.permissions = getPermissions(k.groups);
        this.loading--;
      });
  }
  getChecked(name: string) {
    return (
      this.permissions.find((per) => per.name === name) || { isGranted: false }
    )?.isGranted;
  }

  isGrantedByOtherProviderName(grantedProviders: ProviderInfoDto[]): boolean {
    if (grantedProviders.length) {
      return (
        grantedProviders.findIndex(
          (p) => p.providerName !== this.providerName
        ) > -1
      );
    }
    return false;
  }

  onClickCheckbox(clickedPermission: PermissionGrantInfoDto, checked) {
    if (
      checked &&
      this.isGrantedByOtherProviderName(clickedPermission.grantedProviders)
    ) {
      return;
    }

    setTimeout(() => {
      this.permissions = this.permissions.map((per) => {
        if (clickedPermission.name === per.name) {
          return { ...per, isGranted: !per?.isGranted };
        } else if (clickedPermission.name === per.parentName && !checked) {
          return { ...per, isGranted: false };
        } else if (clickedPermission.parentName === per.name && checked) {
          return { ...per, isGranted: true };
        }

        return per;
      });

      this.setTabCheckboxState();
      this.setGrantCheckboxState();
    }, 0);
  }

  setTabCheckboxState() {
    this.selectedGroupPermissions$.pipe(take(1)).subscribe((permissions) => {
      // TODO: fix selection logic with angular material
      permissions.filter((per) => per?.isGranted).length === permissions.length
        ? (this.selectThisTab = true)
        : (this.selectThisTab = false);
      this.selectThisTabIntermediate = this.intermediateGroupSelection(
        permissions
      );
    });
  }

  setGrantCheckboxState() {
    this.permissions.filter((per) => per?.isGranted).length ===
    this.permissions.length
      ? (this.selectAllTab = true)
      : (this.selectAllTab = false);
  }

  onClickSelectThisTab(checked) {
    this.selectedGroupPermissions$.pipe(take(1)).subscribe((permissions) => {
      permissions.forEach((permission) => {
        if (
          permission?.isGranted &&
          this.isGrantedByOtherProviderName(permission.grantedProviders)
        ) {
          return;
        }

        const index = this.permissions.findIndex(
          (per) => per.name === permission.name
        );

        this.permissions = [
          ...this.permissions.slice(0, index),
          { ...this.permissions[index], isGranted: !this.selectThisTab },
          ...this.permissions.slice(index + 1),
        ];
      });
    });

    this.selectThisTab = checked;
    this.setGrantCheckboxState();
  }

  onClickSelectAll(checked) {
    this.permissions = this.permissions.map((permission) => ({
      ...permission,
      isGranted:
        this.isGrantedByOtherProviderName(permission.grantedProviders) ||
        !this.selectAllTab,
    }));

    this.selectThisTab = !this.selectAllTab;
    this.selectAllTab = checked;
  }

  intermediateAllSelection(): boolean {
    if (this.permissions == null) {
      return false;
    }
    const all_permission_count = this.permissions.length;
    const selected_permission_count = this.permissions.filter(
      (t) => t?.isGranted
    ).length;
    return (
      selected_permission_count > 0 &&
      all_permission_count > selected_permission_count
    );
  }
  intermediateGroupSelection(permissions: PermissionGrantInfoDto[]): boolean {
    if (permissions == null) {
      return false;
    }
    const all_permission_group_count = permissions.length;
    const selected_permission_count = permissions.filter((t) => t?.isGranted)
      .length;
    return (
      selected_permission_count > 0 &&
      all_permission_group_count > selected_permission_count
    );
  }

  onChangeGroup(group: PermissionGroupDto) {
    this.selectedGroup = group;
    this.setTabCheckboxState();
  }

  submit() {
    const unchangedPermissions = getPermissions(this.groups$.value);
    const changedPermissions = this.permissions
      .filter((per) =>
        unchangedPermissions.find((unchanged) => unchanged.name === per.name)
          .isGranted === per.isGranted
          ? false
          : true
      )
      .map(({ name, isGranted }) => ({ name, isGranted }));
    if (!changedPermissions.length) {
      this.visible = false;
      return;
    }
    this.loading++;
    this.permissionsService
      .update(this.providerName, this.providerKey, {
        permissions: changedPermissions,
      })
      .pipe(
        map(() =>
          this.shouldFetchAppConfig()
            ? this.store.dispatch(startLoadingAbpApplicationData())
            : of(null)
        ),
        finalize(() => this.loading--)
      )
      .subscribe(() => {
        this.dialogRef?.close();
      });
  }

  getAssignedCount(groupName: string) {
    return this.permissions.reduce(
      (acc, val) =>
        val.name.split('.')[0] === groupName && val?.isGranted ? acc + 1 : acc,
      0
    );
  }

  shouldFetchAppConfig() {

    return false;
  }
  ngOnInit(): void {}
  canSave() {
    return true;
  }
  save() {}
}

function findMargin(
  permissions: PermissionGrantInfoDto[],
  permission: PermissionGrantInfoDto
) {
  const parentPermission = permissions.find(
    (per) => per.name === permission.parentName
  );

  if (parentPermission && parentPermission.parentName) {
    let margin = 20;
    return (margin += findMargin(permissions, parentPermission));
  }

  return parentPermission ? 20 : 0;
}

function getPermissions(
  groups: PermissionGroupDto[]
): PermissionGrantInfoDto[] {
  return groups.reduce((acc, val) => [...acc, ...val.permissions], []);
}
