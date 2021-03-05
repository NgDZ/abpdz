import { Pipe, PipeTransform } from '@angular/core';
import { EnumsService } from './enums.service';

@Pipe({
  name: 'enumsDisplay',
})
export class EnumsDisplayPipe implements PipeTransform {
  constructor(public enums: EnumsService) {}
  transform(value: any, ...args: any[]): any {
    if (
      this.enums.displays[args[0]] == null ||
      this.enums.displays[args[0]][value] == null
    ) {
      return '';
    }
    return this.enums.displays[args[0]][value];
  }
}
