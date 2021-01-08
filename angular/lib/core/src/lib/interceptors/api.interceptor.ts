import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AbpFacade } from '../ngrx/abp.facade';
import { SessionStateService } from '../services/session-state.service';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private abp: SessionStateService,
    private oAuthService: AuthService // private store: Store, // private sessionState: SessionStateService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // this.store.dispatch(new StartLoader(request));

    return next.handle(
      request.clone({
        setHeaders: this.getAdditionalHeaders(request.headers),

        withCredentials: true,
      })
    );
    // .pipe(finalize(() => this.store.dispatch(new StopLoader(request))));
  }

  getAdditionalHeaders(existingHeaders?: HttpHeaders) {
    const headers = {} as any;
    (window as any).oAuthService = this.oAuthService;
    const token = this.oAuthService.getAccessToken();
    if (!existingHeaders?.has('Authorization') && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const lang = this.abp.getLanguage();
    if (!existingHeaders?.has('Accept-Language') && lang) {
      headers['Accept-Language'] = lang;
    }

    const tenant = this.abp.getTenant();
    if (!existingHeaders?.has('__tenant') && tenant && tenant.id) {
      headers['__tenant'] = tenant.id;
    }

    return headers;
  }
}
