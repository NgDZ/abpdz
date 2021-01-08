import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  constructor(private service: LocalizationService) {}
  transform(value: any): any {
    return this.service.instant(value);
  }
}

@NgModule({
  declarations: [TranslatePipe],
  exports: [TranslatePipe],
  imports: [CommonModule],
})
export class TranslateModule {
  static forRoot(): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [],
    };
  }
  static forChild(): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [],
    };
  }
}
