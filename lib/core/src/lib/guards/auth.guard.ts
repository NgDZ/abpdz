import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private injector: Injector, private authService: AuthService) {}

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      map((k) => k.isAuthenticated),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.authService.initLogin(state.url);
        }
      })
    );
  }
}
