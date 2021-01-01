import { Injectable } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor(private service: LocalizationService) {}
  transform(value: any): any {
    return this.service.instant(value);
  }
  get currentLang() {
    // return this.service.currentLang;
    return '';
  }
  use(cultureName) {
    // this.store.dispatch(new SetLanguage(cultureName));
  }

  addLangs(any?) {}
  setDefaultLang(any?) {}
  setTranslation(lng?, data?, conf?) {}
}
