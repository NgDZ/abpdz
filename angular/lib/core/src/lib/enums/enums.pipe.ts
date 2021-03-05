import { Pipe, PipeTransform } from '@angular/core';
import { EnumsService } from './enums.service';

@Pipe({
  name: 'enums',
})
export class EnumsPipe implements PipeTransform {
  constructor(public enums: EnumsService) {}
  transform(value: any, ...args: any[]): any {
    console.log(args[0], this.enums.keys[args[0]].childs);
    if (
      this.enums.keys[args[0]] == null ||
      this.enums.keys[args[0]].childs == null
    ) {
      return [];
    }
    return this.enums.keys[args[0]].childs;
  }
}
