import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Config } from '../models/config';
import { LocalizationService } from '../services/localization.service';

@Pipe({
  name: 'abpLocalization',
})
export class LocalizationPipe implements PipeTransform {
  constructor(protected localization: LocalizationService) {}

  transform(
    value: string | Config.LocalizationWithDefault = '',
    ...interpolateParams: string[]
  ): string {
    return this.localization.instant(
      value,
      ...interpolateParams.reduce(
        (acc, val) => (Array.isArray(val) ? [...acc, ...val] : [...acc, val]),
        []
      )
    );
  }
}
