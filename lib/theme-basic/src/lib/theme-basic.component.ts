import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-theme-basic',
  template: `
    <p>
      theme-basic works!
    </p>
  `,
  styles: [
  ]
})
export class ThemeBasicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
