import { eLayoutType, RoutesService } from '@abpdz/ng.core';
import { eThemeSharedRouteNames } from '@abpdz/ng.theme.shared';
import { APP_INITIALIZER } from '@angular/core';
 
import { eIdentityPolicyNames } from '../enums/policy-names';
import { eIdentityRouteNames } from '../enums/route-names';

export const IDENTITY_ROUTE_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: configureRoutes,
    deps: [RoutesService],
    multi: true,
  },
];

export function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/identity/roles',
        name: eIdentityRouteNames.Roles,
        parentName: eThemeSharedRouteNames.Administration,
        requiredPolicy: eIdentityPolicyNames.Roles,
        iconClass: 'perm_identity',
        layout: eLayoutType.application,
        order: 10,
      },
      {
        path: '/identity/users',
        name: eIdentityRouteNames.Users,
        iconClass: 'supervised_user_circle',
        parentName: eThemeSharedRouteNames.Administration,
        layout: eLayoutType.application,
        requiredPolicy: eIdentityPolicyNames.Users,
        order: 20,
      },
    ]);
  };
}
