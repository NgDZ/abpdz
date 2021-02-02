import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MiniProfilerInterceptor implements HttpInterceptor {
  constructor() {
    if (isDevMode()) {
      console.log(
        "to enable miniprofiler localStorage.setItem('USE_MINIPROFILER','true')"
      );
    }
  }
  static loaded = false;
  static id = 0;
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isDevMode()) {
      return next.handle(req);
    }
    if (localStorage.getItem('USE_MINIPROFILER') != 'true') {
      return next.handle(req);
    }
    if (MiniProfilerInterceptor.loaded === false) {
      MiniProfilerInterceptor.loaded = true;
      const s = document.createElement('script');
      s.setAttribute('src', '/profiler/includes.min.js');
      s.setAttribute('id', 'mini-profiler');
      s.setAttribute('async', 'async');
      s.setAttribute('data-path', '/profiler/');
      s.setAttribute('data-ids', '');
      s.setAttribute('data-current-id', '');
      s.setAttribute('data-position', 'BottomLeft');
      s.setAttribute('data-scheme', 'Auto');
      s.setAttribute('data-authorized', 'true');
      s.setAttribute('data-controls', 'true');
      s.setAttribute('data-children', 'true');
      // s.setAttribute('data-trivial', 'true');
      s.setAttribute('data-max-traces', '16');
      s.setAttribute('data-toggle-shortcut', 'Alt+h');
      s.setAttribute('data-trivial-milliseconds', '2.0');
      s.setAttribute(
        'data-ignored-duplicate-execute-types',
        'Open,OpenAsync,Close,CloseAsync'
      );
      document.body.appendChild(s);
    }
    return next.handle(req).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (
            typeof (window as any).MiniProfiler !== 'undefined' &&
            evt &&
            evt.headers
          ) {
            this.makeMiniProfilerRequests(evt.headers);
          }
        }
      })
    );
  }

  private makeMiniProfilerRequests(headers: HttpHeaders) {
    try {
      const miniProfilerHeaders = headers.getAll('x-miniprofiler-ids');

      if (!miniProfilerHeaders) {
        return;
      }

      miniProfilerHeaders.forEach((miniProfilerIdHeaderValue) => {
        const ids = JSON.parse(miniProfilerIdHeaderValue) as string[];
        (window as any).MiniProfiler.fetchResults(ids);
      });
    } catch (error) {}
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
