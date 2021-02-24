import { abpAnimations } from '@abpdz/ng.theme.shared';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  animations: abpAnimations,
})
export class UnauthorizedAccessComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
