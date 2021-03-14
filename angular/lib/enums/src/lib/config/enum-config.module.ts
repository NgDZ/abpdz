import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { eLayoutType, RoutesService } from '@abpdz/ng.core';
import { eThemeSharedRouteNames } from '@abpdz/ng.theme.shared';

export function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: 'enums/config',
        name: 'AbpDz::Enums',
        parentName: eThemeSharedRouteNames.Administration,
        requiredPolicy: 'ABPDZ.Enums',
        iconClass: 'table_chart',
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
export class EnumsConfigModule {
  static forRoot(): ModuleWithProviders<EnumsConfigModule> {
    return {
      ngModule: EnumsConfigModule,
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
