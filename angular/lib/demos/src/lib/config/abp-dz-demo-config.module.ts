import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { eLayoutType, RoutesService } from '@abpdz/ng.core';

export function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/demos/pings',
        name: 'Pings',
        parentName: 'Demos',
        iconClass: 'caller',
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
export class AbpDzDemoConfigModule {
  static forRoot(): ModuleWithProviders<AbpDzDemoConfigModule> {
    return {
      ngModule: AbpDzDemoConfigModule,
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
