import { AbpFacade, ListResultDto } from '@abpdz/ng.core';
import { PermissionManagementService } from '@abpdz/ng.permission-management';
import {
  AbpIOHttpService,
  getPasswordValidators,
  RestMaterialTableComponent,
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { abpAnimations } from '@abpdz/ng.theme.shared';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { Identity } from '../../models/identity';
import {
  IdentityRoleDto,
  IdentityUserService,
  IdentityUserUpdateDto,
} from '../../proxy/identity';
import { UserData } from '../../proxy/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  animations: abpAnimations,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent
  extends RestMaterialTableComponent<UserData>
  implements OnInit, AfterViewInit {
  roles: any;
  selectedUserRoles: any;
  roles$: Observable<ListResultDto<IdentityRoleDto>>;
  constructor(
    injector: Injector,
    httpClient: HttpClient,
    private facade: AbpFacade,
    private fb: FormBuilder,
    private identityService: IdentityUserService,
    private permissionManagementService: PermissionManagementService
  ) {
    super(new AbpIOHttpService(httpClient, '/api/identity/users'), injector);
    this.displayedColumns = ['Actions', 'userName', 'email', 'phoneNumber'];
    this.roles$ = this.identityService.getAssignableRoles().pipe(shareReplay());
  }
  newUser() {
    this.editForm = null;
    this.newEdit();
    this.buildForm();
  }
  editUser(u) {
    this.editForm = null;
    this.startEdit(u);
    this.current = u;
    this.identityService
      .get(u.id)
      .pipe(
        tap((k) => (this.current = k)),
        switchMap((k) => this.identityService.getRoles(u.id))
      )
      .subscribe((k) => {
        this.selectedUserRoles = k.items;
        this.buildForm();
      });
  }
  saveUser() {
    if (this.editForm.invalid) {
      return;
    }
    const val = this.editForm.value;
    this.save({
      ...this.current,
      ...val,
      roleNames: val.roleNames
        .filter((k) => Object.values(k)[0])
        .map((k) => Object.keys(k)[0]),
    });
  }
  buildForm(cb?) {
    this.roles$.subscribe(({ items }) => {
      this.roles = items;
      this.editForm = this.fb.group({
        userName: [
          this.current.userName || '',
          [Validators.required, Validators.maxLength(256)],
        ],
        email: [
          this.current.email || '',
          [Validators.required, Validators.email, Validators.maxLength(256)],
        ],
        name: [this.current.name || '', [Validators.maxLength(64)]],
        surname: [this.current.surname || '', [Validators.maxLength(64)]],
        phoneNumber: [
          this.current.phoneNumber || '',
          [Validators.maxLength(16)],
        ],
        lockoutEnabled: [
          this.current.lockoutEnabled || (this.current.id ? false : true),
        ],
        twoFactorEnabled: [
          this.current.twoFactorEnabled || (this.current.id ? false : true),
        ],
        roleNames: this.fb.array(
          this.roles.map((role) =>
            this.fb.group({
              [role.name]: [
                this.current.id
                  ? !!this.selectedUserRoles?.find(
                      (userRole) => userRole.id === role.id
                    )
                  : role.isDefault,
              ],
            })
          )
        ),
      });

      const passwordValidators = getPasswordValidators(
        this.facade.abp?.conf?.setting?.values
      );

      this.editForm.addControl(
        'password',
        new FormControl('', [...passwordValidators])
      );

      if (!this.current.userName) {
        this.editForm
          .get('password')
          .setValidators([...passwordValidators, Validators.required]);
        this.editForm.get('password').updateValueAndValidity();
      }
      if (cb) {
        cb();
      }
    });
  }
  newObject(): Observable<Partial<UserData>> {
    return of({
      //  id: '4eeb5898-5da2-4b74-94e4-6f6bfa55b752',
      // codeType: 0,
      extraProperties: {},
    } as any);
  }
  ngOnInit() {
    // this.api.getAllPermissions().subscribe(v => {
    //   this.lookups.permissions = v.items;
    //   this.lookups.permissionsNames = v.items.map(z => z.name);
    // });
    this.prepareComponent();
  }
  ngAfterViewInit() {}
  get roleGroups() {
    return (this.editForm?.get('roleNames') as FormArray)
      ?.controls as FormGroup[];
  }
  trackByFn: TrackByFunction<AbstractControl> = (index, item) =>
    Object.keys(item)[0] || index;

  openPermissionsModal(id) {
    this.permissionManagementService.managePermissions({
      providerName: 'U',
      providerKey: id,
    });
  }
}