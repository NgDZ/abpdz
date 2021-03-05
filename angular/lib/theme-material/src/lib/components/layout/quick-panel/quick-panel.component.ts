import { LOCALE_ID } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  isDevMode,
  OnInit,
} from '@angular/core';
import { LocaleValue } from '@abpdz/ng.core';
@Component({
  selector: 'mtheme-quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickPanelComponent implements OnInit {
  constructor(
    @Inject(LOCALE_ID) public locale,
    public l: LocaleValue
  ) {}
  today() {
    return new Date();
  }

  ngOnInit(): void {}
  isDev() {
    return isDevMode();
  }
  isMiniprofilerActive() {
    return localStorage.getItem('USE_MINIPROFILER') == 'true';
  }
  toggleMiniProfiler() {
    if (this.isMiniprofilerActive()) {
      localStorage.removeItem('USE_MINIPROFILER');
    } else {
      localStorage.setItem('USE_MINIPROFILER', 'true');
    }
  }
}
