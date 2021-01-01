import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'abp-dynamic-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet></router-outlet>',
})
export class DynamicLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
