import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Type, ɵstringify as stringify } from '@angular/core';
import { LocaleValue } from '../utils/register-locale';

export function invalidPipeArgumentError(type: Type<any>, value: Object) {
  return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}
@Pipe({ name: 'abpDate', pure: true })
export class AbpDatePipe implements PipeTransform {
  constructor(private l: LocaleValue) {}

  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   * @param format The date/time components to include, using predefined options or a
   * custom format string.
   * @param timezone A timezone offset (such as `'+0430'`), or a standard
   * UTC/GMT or continental US timezone abbreviation.
   * When not supplied, uses the end-user's local system timezone.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   * @returns A date string in the desired format.
   */
  transform(
    value: Date | string | number,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null;
  transform(
    value: null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): null;
  transform(
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null;
  transform(
    value: Date | string | number | null | undefined,
    format = 'mediumDate',
    timezone?: string,
    locale?: string
  ): string | null {
    if (value == null || value === '' || value !== value) return null;

    try {
      return formatDate(value, format, locale || this.l.getLocale(), timezone);
    } catch (error) {
      throw invalidPipeArgumentError(AbpDatePipe, error.message);
    }
  }
}
