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
  getIcon(not: AbpDzNotificationInfo) {
    let base = '';
    switch (not?.severity) {
      case AbpDzSeverity.Fatal:
        return 'dangerous';
      case AbpDzSeverity.Error:
        return 'error';

      case AbpDzSeverity.Info:
        return 'info';

      case AbpDzSeverity.Success:
        return 'check_circle';

      case AbpDzSeverity.Warn:
        return 'warning';
      default:
        break;
    }
    return '';
  }
  markAsRead(not: AbpDzNotificationInfo) {
    this.service.dismiss([not.id]).subscribe((k) => {});
  }
  getClass(not: AbpDzNotificationInfo) {
    let base = not?.state === 0 ? 'bold ' : ' ';

    switch (not?.severity) {
      case AbpDzSeverity.Fatal:
        return base + 'color-fatal';
      case AbpDzSeverity.Error:
        return base + 'color-error';

      case AbpDzSeverity.Info:
        return base + 'color-info';

      case AbpDzSeverity.Success:
        return base + 'color-success';

      case AbpDzSeverity.Warn:
        return base + 'color-warn';
      default:
        break;
    }
    return base;
  }
  dismiss(a?, b?) {}
}
