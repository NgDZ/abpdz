import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'mtheme-quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickPanelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
