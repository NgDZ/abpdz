import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tenant-box',
  templateUrl: './tenant-box.component.html',
  styleUrls: ['./tenant-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantBoxComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
