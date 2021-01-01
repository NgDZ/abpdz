import {
  ChangeDetectorRef,
  Injector,
  OnDestroy,
  Component,
  isDevMode,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoggerService } from '../services';
// import { TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '@abpdz/ng.core';

@Component({
  template: '',
})
export class BaseAsyncComponent implements OnDestroy {
  protected cd: ChangeDetectorRef = this.injector.get(ChangeDetectorRef);
  title: string;
  protected logger: LoggerService = this.injector.get(LoggerService);
  protected translate: LocalizationService = this.injector.get(
    LocalizationService
  );
  destroyed$ = new Subject<any>();

  protected _loading = 0;
  public get loading(): number {
    return this._loading;
  }
  get isProd() {
    return !isDevMode();
  }

  get isDev() {
    return isDevMode();
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  public set loading(v: number) {
    if (v < 0) {
      v = 0;
    }
    if (this._loading !== v) {
      this.loading$.next(v);
    }
    if (v < 0) {
      v = 0;
    }
    this._loading = v;
  }
  public loading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(protected injector: Injector) {}
  ngOnDestroy(): void {
    this.beforeDestroy();
    this.destroyed$.next(true);
    setTimeout(() => {
      this.destroyed$.complete();
    }, 200);
  }
  beforeDestroy() {}

  protected asyncError(e: any) {
    if (this.loading > 0) {
      this.loading--;
    }
    this.logger.asyncError(e);
  }
  log(k) {
    console.log(k);
  }
}
