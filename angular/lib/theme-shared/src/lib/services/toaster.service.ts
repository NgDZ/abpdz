import { Injectable, ComponentRef } from '@angular/core';
import { Toaster } from '../models';
import { ReplaySubject } from 'rxjs';
import { Config, LocalizationService } from '@abpdz/ng.core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(
    private toast: ToastrService,
    private translate: LocalizationService
  ) {}

  /**
   * Creates an info toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Spesific style or structural options for individual toast
   */
  info(
    message: Config.LocalizationParam,
    title?: Config.LocalizationParam,
    options?: Partial<Toaster.ToastOptions>
  ): number {
    return this.show(message, title, 'info', options);
  }

  /**
   * Creates a success toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Spesific style or structural options for individual toast
   */
  success(
    message: Config.LocalizationParam,
    title?: Config.LocalizationParam,
    options?: Partial<Toaster.ToastOptions>
  ): number {
    return this.show(message, title, 'success', options);
  }

  /**
   * Creates a warning toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Spesific style or structural options for individual toast
   */
  warn(
    message: Config.LocalizationParam,
    title?: Config.LocalizationParam,
    options?: Partial<Toaster.ToastOptions>
  ): number {
    return this.show(message, title, 'warning', options);
  }

  /**
   * Creates an error toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param options Spesific style or structural options for individual toast
   */
  error(
    message: Config.LocalizationParam,
    title?: Config.LocalizationParam,
    options?: Partial<Toaster.ToastOptions>
  ): number {
    return this.show(message, title, 'error', options);
  }

  /**
   * Creates a toast with given parameters.
   * @param message Content of the toast
   * @param title Title of the toast
   * @param severity Sets color of the toast. "success", "warning" etc.
   * @param options Spesific style or structural options for individual toast
   */

  show(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam = null,
    severity: Toaster.Severity = 'neutral',
    options = {} as Partial<Toaster.ToastOptions>
  ): number {
    this.toast.show(
      this.translate.instant(message),
      this.translate.instant(title),
      options,
      severity
    );
    return 0;
  }

  /**
   * Removes the toast with given id.
   * @param id ID of the toast to be removed.
   */
  remove(id: number): void {}

  /**
   * Removes all open toasts at once.
   */
  clear(key?: string): void {}
}
