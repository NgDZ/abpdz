import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { eLayoutType, RoutesService } from '@abpdz/ng.core';
import { eThemeSharedRouteNames } from '@abpdz/ng.theme.shared';

export function configureRoutes(routes: RoutesService) {
  return () => {
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
          deps: [RoutesService],
          multi: true,
        },
      ],
    };
  }
}
