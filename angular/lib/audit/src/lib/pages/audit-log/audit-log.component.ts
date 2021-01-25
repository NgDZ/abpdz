import {
  AuditLog,
  AuthService,
  dateToIso,
  EventFilterDto,
} from '@abpdz/ng.core';
import {
  BaseCrudComponent,
  RestDataSource,
  AbpIOHttpService,
  abpAnimations,
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogComponent
  extends BaseCrudComponent<AuditLog>
  implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  userId: string = null;
  constructor(
    injector: Injector,
    private httpClient: HttpClient,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    super(injector);
    this.displayedColumns = [
      'Action',
      'Time',
      'clientIpAddress',
      'Browser',
      'Client',
      'Router',
    ];
    this.searchForm = this.fb.group({
      filter: [],
      id: [],
      type: [],
      source: [],
      creator: [],
      userId: [],
      startDate: [],
      endDate: [],
      code: [],
      state: [],
      severity: [],
      checked: [],
    });
  }
  openPermissionsModal(id) {}

  ngOnInit() {
    // this.api.getAllPermissions().subscribe(v => {
    //   this.lookups.permissions = v.items;
    //   this.lookups.permissionsNames = v.items.map(z => z.name);
    // });
    this.dataSource = new RestDataSource(
      new AbpIOHttpService(this.httpClient, '/api/audit-logging/audit-logs')
    );
    this.dataSource.setServices(this.logger, this.translate);
    if (this.userId == null) {
      this.userId = this.auth?.currentUser?.id;
    }
    this.dataSource.filter.next({ userId: this.userId });
  }
  applyFilter() {
    const val: Partial<EventFilterDto> = {
      ...this.searchForm.value,
      userId: this.userId,
    };
    const a: any = val;
    val.startDate = dateToIso(a.startDate);
    val.endDate = dateToIso(a.endDate);
    this.dataSource.filter.next(val);
  }
  actionClass(action) {
    switch (action) {
      case 'LoginNotAllowed':
      case 'LoginLockedout':
      case 'LoginFailed':
      case 'LoginInvalidUserNameOrPassword':
      case 'LoginInvalidUserName':
        return 'color-error';

      case 'LoginSucceeded':
        return 'color-success';
    }
    return ' ';
  }
  actionIcon(action) {
    let base = '';
    switch (action) {
      case 'LoginNotAllowed':
      case 'LoginLockedout':
        return 'warning';
      case 'LoginFailed':
      case 'LoginInvalidUserNameOrPassword':
      case 'LoginInvalidUserName':
        return 'error';

      case 'LoginSucceeded':
        return 'check_circle';
    }
    return base;
  }
  ngAfterViewInit() {}
}

