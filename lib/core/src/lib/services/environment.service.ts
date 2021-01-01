import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Config } from '../models/config';
import { Apis, Environment } from '../models/environment';
import { selectCurrentCulture, selectEnvironment } from '../ngrx/abp.reducer';
import { setEnvirement } from '../ngrx/abp.actions';
@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  appEnvironment$: Observable<Config.Environment>;
  appEnvironment: Config.Environment;
  constructor(private ngxStore: Store) {
    this.appEnvironment$ = this.ngxStore
      .select(selectEnvironment)
      .pipe(filter((k) => k != null));
    this.appEnvironment$.subscribe((k) => (this.appEnvironment = k));
  }

  get createOnUpdateStream() {
    return this.appEnvironment$;
  }

  getEnvironment$(): Observable<Environment> {
    return this.appEnvironment$;
  }

  getEnvironment(): Environment {
    return this.appEnvironment;
  }

  getApiUrl(key?: string) {
    return (
      this.appEnvironment.apis[key || 'default'] ||
      this.appEnvironment.apis.default
    ).url;
  }

  getApiUrl$(key?: string) {
    return this.appEnvironment$
      .pipe(map((state) => state.apis))
      .pipe(map((apis: Apis) => (apis[key || 'default'] || apis.default).url));
  }

  setState(environment: Environment) {
    this.ngxStore.dispatch(setEnvirement({ data: environment }));
  }
}
