import { BaseAsyncComponent } from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-configs',
  templateUrl: './model-configs.component.html',
  styleUrls: ['./model-configs.component.scss'],
})
export class ModelConfigsComponent
  extends BaseAsyncComponent
  implements OnInit {
  constructor(private httpClient: HttpClient, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}