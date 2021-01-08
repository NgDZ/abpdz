import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-application-layout',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialRootComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
