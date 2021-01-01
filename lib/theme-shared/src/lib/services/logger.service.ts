import { Injectable, Optional } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
// import { ObjectPropertiesComponent } from '../components/scrollbar/object-properties/object-properties.component';
// import { TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '@abpdz/ng.core';

export interface ILoggerInfo {
  title?: string;
  message?: string;
  data?: any;
  source?: string;
  showToast?: boolean;
}

export interface ILogger {
  log(params: ILoggerInfo);
  logError(params: ILoggerInfo);
  logSuccess(params: ILoggerInfo);
  logWarning(params: ILoggerInfo);
}
@Injectable({ providedIn: 'root' })
export class LoggerService implements ILogger {
  // private toastr: any = {};
  logIt(params: ILoggerInfo, warnType: any): any {}
  constructor(
    @Optional() private toastr: ToastrService,
    @Optional() private dialog: MatDialog,
    @Optional() private translate: LocalizationService
  ) {}

  log(params: ILoggerInfo) {
    this.logIt(params, 'info');
    this.toastr.info(params.message);
  }

  logWarning(params: ILoggerInfo) {
    this.logIt(params, 'warning');
    this.toastr.warning(params.message);
  }

  logSuccess(params: ILoggerInfo) {
    this.logIt(params, 'success');
    this.toastr.success(this.extractStringError(params.message));
  }
  Success(message) {
    this.toastr.success(this.extractStringError(message));
  }
  warning(message) {
    this.toastr.warning(this.extractStringError(message));
  }

  Error(message) {
    this.toastr.error(this.extractStringError(message));
  }
  logError(params: ILoggerInfo) {
    this.logIt(params, 'error');
    this.toastr.error(params.message);
  }
  asyncError(error) {
    const msg = this.extractStringError(error);

    this.toastr.error(msg);
  }

  showObjectProperties(data: any) {
    // todo implement
    // const dialogRef = this.dialog.open(ObjectPropertiesComponent, {
    //   panelClass: 'overflow-hidden',
    //   data: data
    // });
  }

  private extractStringError(error: any) {
    let e = error;
    if (typeof error === 'string') {
      try {
        const k = JSON.parse(error);
        e = k;
      } catch (er) {
        return error;
      }
    }
    if (e.response) {
      if (typeof e.response === 'string') {
        try {
          const k = JSON.parse(e.response);
          e = k.error || k;
        } catch (er) {
          return e.response;
        }
      }
    }
    if (e.error) {
      if (typeof e.error === 'string') {
        try {
          const k = JSON.parse(e.error);
          e = k.error || k;
        } catch (er) {
          return e.error;
        }
      } else e = e.error;
      e = e.error || e;
    }
    return e.message || e.error || e.code || e;
  }
}
