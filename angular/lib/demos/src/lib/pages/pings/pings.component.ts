import { BaseAsyncComponent } from '@abpdz/ng.theme.shared';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';

@Component({
  selector: 'app-pings',
  templateUrl: './pings.component.html',
  styleUrls: ['./pings.component.scss'],
})
export class PingsComponent extends BaseAsyncComponent implements OnInit {
  constructor(private httpClient: HttpClient, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
  pingNotification(persiste) {
    this.loading++;
    this.httpClient
      .get('/api/abpdz-notification/Ping', {
        params: {
          persiste,
        },
      })
      .subscribe(
        (k) => {
          this.loading--;
          this.logger.Success(
            this.translate.instant('AbpSettingManagement::SuccessfullySaved')
          );
        },
        (e) => this.asyncError(e)
      );
  }
}
