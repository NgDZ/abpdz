import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'abp-layout-application',
  templateUrl: './application-layout.component.html',
  styleUrls: ['./application-layout.component.scss'],
  animations: [],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationLayoutComponent
  implements AfterViewInit, OnInit, OnDestroy {
  ngAfterViewInit(): void {}
  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
