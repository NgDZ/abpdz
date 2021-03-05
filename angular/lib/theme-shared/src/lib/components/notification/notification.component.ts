import { NotificationsService } from '../../services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { abpAnimations } from '../../animations';
import { Observable } from 'rxjs';
import { AbpDzNotificationInfo, AbpDzSeverity, SubSink } from '@abpdz/ng.core';
import { map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'abp-notification',
  templateUrl: './notification.component.html',
  animations: abpAnimations,
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isOpen = false;
  acitveNotifications$: Observable<AbpDzNotificationInfo[]>;
  constructor(public service: NotificationsService, public router: Router) {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.acitveNotifications$ = this.service.abpdzNotification$.pipe(
      map((k) => k?.filter((f) => f.state == 0))
    );
    this.subs.add(this.service.notification$.subscribe());
  }
  markAsRead(nots: AbpDzNotificationInfo[], navigate = false) {
    this.service
      .dismiss(nots?.filter((k) => k.state == 0).map((not) => not.id))
      .subscribe((k) => {});
    if (navigate && nots[0]?.detailUrl) {
      this.router.navigateByUrl(nots[0]?.detailUrl);
    }
  }
  getClass(not: AbpDzNotificationInfo) {
    return this.service.getClass(not);
  }
  getIcon(not: AbpDzNotificationInfo) {
    return this.service.getIcon(not);
  }
  dismiss(a?, b?) {}
}
