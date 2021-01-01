import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { RestOccurError } from '../ngrx';
import { PermissionService, RoutesService } from '../services';
@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private routesService: RoutesService,
    private store: Store,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  private redirectToLogin(state: RouterStateSnapshot): void {
    this.authService.initLogin(state.url);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let { requiredPolicy } = route.data || {};

    if (!requiredPolicy) {
      // todo: fin work around for this item
      // const routeFound = findRoute(
      //   this.routesService,
      //   getRoutePath(this.router, state.url)
      // );
      // requiredPolicy = routeFound?.requiredPolicy;
    }

    if (!requiredPolicy) {
      return of(true);
    }

    return this.permissionService.getGrantedPolicy$(requiredPolicy).pipe(
      tap((access) => {
        if (!access) {
          this.store.dispatch(RestOccurError({ data: { status: 403 } }));
        }
      })
    );
  }
}
