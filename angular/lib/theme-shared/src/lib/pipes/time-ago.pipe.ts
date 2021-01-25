import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abpTimeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    try {
      if (value == null || value == '') {
        return '';
      }
      const date = new Date(value);
      var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

      var interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + ' years';
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + ' months';
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + ' days';
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + ' hours';
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + ' minutes';
      }
      return Math.floor(seconds) + ' seconds';
    } catch (error) {}
    return '';
  }
}
