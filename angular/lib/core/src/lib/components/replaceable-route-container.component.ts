import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'abp-replaceable-route-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet></router-outlet>',
})
export class ReplaceableRouteContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
