import {
  AbpDzNotificationInfo, AuthService,
  DataConfigService,
  dateToIso,
  EventFilterDto, EventFilterDtoForm
} from '@abpdz/ng.core';
import {
  abpAnimations, AbpIOHttpService, BaseCrudComponent, NotificationsService, RestDataSource
} from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-history',
  templateUrl: './notifications-history.component.html',
  styleUrls: ['./notifications-history.component.scss'],
  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsHistoryComponent
  extends BaseCrudComponent<AbpDzNotificationInfo>
  implements OnInit, AfterViewInit
{
  searchForm: FormGroup;
  userId: string = null;
  constructor(
    injector: Injector,
    private httpClient: HttpClient,
    private auth: AuthService,
    private dataConfig: DataConfigService,
    public service: NotificationsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(injector);
    this.displayedColumns = ['Icon', 'Time', 'Message'];
    this.searchForm = this.fb.group(EventFilterDtoForm);
  }
  openPermissionsModal(id) {}

  ngOnInit() {
    // this.api.getAllPermissions().subscribe(v => {
    //   this.lookups.permissions = v.items;
    //   this.lookups.permissionsNames = v.items.map(z => z.name);
    // });
    this.dataSource = new RestDataSource(
      new AbpIOHttpService(this.httpClient, '/api/abpdz-notification/GetAll')
    );
    this.dataSource.setServices(this.logger, this.translate);
    // if (this.userId == null) {
    //   this.userId = this.auth?.currentUser?.id;
    // }
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
  markAsRead(nots: AbpDzNotificationInfo[], navigate = false) {
    this.service
      .dismiss(nots?.filter((k) => k.state == 0).map((not) => not.id))
      .subscribe((k) => {});
    if (navigate && nots[0]?.detailUrl) {
      this.router.navigateByUrl(nots[0]?.detailUrl);
    }
  }
  ngAfterViewInit() {}
  getClass(not: AbpDzNotificationInfo) {
    return this.service.getClass(not);
  }
  getIcon(not: AbpDzNotificationInfo) {
    return this.service.getIcon(not);
  }
}
