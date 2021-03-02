import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataConfigService,
  eLayoutType,
  RoutesService,
  UserAdminMenuKey,
} from '@abpdz/ng.core';
import { eThemeSharedRouteNames } from '@abpdz/ng.theme.shared';
import { AuditLogUrlsKey } from './enums';

export function configureRoutes(
  routes: RoutesService,
  data: DataConfigService
) {
  return () => {
    // data.addToList(AuditLogUrlsKey, {
    //   key: 'BackGroundJob',
    //   value: 'Administration',
    // });
    // data.addToList(UserAdminMenuKey, {
    //   name: 'BackGroundJob',
    //   action: (item) => console.log(item),
    // });
    routes.add([
      {
        path: '/audit/log',
        name: 'AbpDz::AuditLogs',
        parentName: eThemeSharedRouteNames.Administration,
        requiredPolicy: 'AbpIdentity.Users',
        iconClass: 'open_in_browser',
        layout: eLayoutType.application,
        order: 10,
      },
      {
        path: '/audit/identity',
        name: 'AbpDz::SecurityLogs',
        layout: eLayoutType.account,
        order: 10,
      },
    ]);
  };
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AbpDzAuditConfigModule {
  static forRoot(): ModuleWithProviders<AbpDzAuditConfigModule> {
    return {
      ngModule: AbpDzAuditConfigModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: configureRoutes,
          deps: [RoutesService, DataConfigService],
          multi: true,
        },
      ],
    };
  }
}
