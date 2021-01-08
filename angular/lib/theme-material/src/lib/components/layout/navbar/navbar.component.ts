import { ABP, RoutesService } from '@abpdz/ng.core';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mtheme-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @Input() smallScreen: boolean;

  trackByFn: TrackByFunction<any> = (_, item) => item.name;

  constructor(
    public readonly routes: RoutesService,
    public dir: Directionality,
    public router: Router
  ) {}
  ngOnInit(): void {}

  isDropdown(node: any): boolean {
    return !node?.isLeaf || this.routes.hasChildren(node.name);
  }
}
