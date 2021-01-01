import { Injectable, isDevMode, NgZone } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpHeaders,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { debounceTime, skipWhile, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MiniProfilerInterceptor implements HttpInterceptor {
  static channel: BroadcastChannel;
  constructor(private ngZone: NgZone) {
    if (isDevMode() && MiniProfilerInterceptor.channel == null) {
      MiniProfilerInterceptor.channel = new BroadcastChannel(
        'mini-profiler-channel'
      );
    }
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isDevMode()) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      tap((evt) => {
        if (
          evt instanceof HttpResponse &&
          evt?.headers?.getAll('x-miniprofiler-ids')
        ) {
          this.ngZone.runOutsideAngular(() => {
            MiniProfilerInterceptor.channel.postMessage(
              evt?.headers?.getAll('x-miniprofiler-ids')
            );
          });
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AddCsrfHeaderInterceptorService implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headerName = 'RequestVerificationToken';
    const token = this.tokenExtractor.getToken();
    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token) });
    }
    return next.handle(req);
  }
}
