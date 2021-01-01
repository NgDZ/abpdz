import { Config } from '@abpdz/ng.core';

// tslint:disable-next-line: no-namespace
export namespace Toaster {
  export interface ToastOptions {
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    tapToDismiss?: boolean;
    messageLocalizationParams?: string[];
    titleLocalizationParams?: string[];
    id: any;
    containerKey?: string;
  }

  export interface Toast {
    message: Config.LocalizationParam;
    title?: Config.LocalizationParam;
    severity?: string;
    options?: ToastOptions;
  }

  export type Severity = 'neutral' | 'success' | 'info' | 'warning' | 'error';
}
