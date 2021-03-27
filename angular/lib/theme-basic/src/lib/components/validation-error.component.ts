import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  InjectionToken,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_ERROR } from '@angular/material/form-field';
import {
  Validation,
  ValidationErrorComponent as ErrorComponent,
} from '@ngx-validate/core';
@Component({
  selector: 'abp-validation-error',
  template: `
    <ng-container *ngFor="let error of abpErrors; trackBy: trackByFn">
      {{ error.message | abpLocalization: error.interpoliteParams }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_ERROR, useExisting: ErrorComponent }],
})
export class ValidationErrorComponent extends ErrorComponent {
  @HostBinding('class')
  class = 'mat-error';
  get abpErrors(): any[] {
    if (!this.errors || !this.errors.length) {
      return [];
    }

    return this.errors.map((error) => {
      if (!error.message) {
        return error;
      }

      const index = error.message.indexOf('[');

      if (index > -1) {
        return {
          ...error,
          message: error.message.slice(0, index),
          interpoliteParams: error.message
            .slice(index + 1, error.message.length - 1)
            .split(','),
        };
      }

      return error;
    });
  }
}
