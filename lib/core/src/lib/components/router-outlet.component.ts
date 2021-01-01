import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'abp-router-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet></router-outlet>',
})
export class RouterOutletComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
