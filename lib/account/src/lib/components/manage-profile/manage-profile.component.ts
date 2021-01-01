import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { abpAnimations } from '@abpdz/ng.theme.shared';
import { Store } from '@ngrx/store';
import { ProfileService, setProfile } from '@abpdz/ng.core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'abp-manage-profile',
  templateUrl: './manage-profile.component.html',

  animations: abpAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .min-h-400 {
        min-height: 400px;
      }
    `,
  ],
})
export class ManageProfileComponent implements OnInit {
  selectedTab = 0;

  isProfileLoaded: boolean;

  hideChangePasswordTab: boolean;
  isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map((result) => result.matches),
      tap((k) => (this.isHandset = k)),
      shareReplay()
    );

  constructor(
    private store: Store,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.profileService.get().subscribe((data) => {
      this.store.dispatch(setProfile({ data }));
      this.isProfileLoaded = true;
      if (data.isExternal) {
        this.hideChangePasswordTab = true;
        this.selectedTab = 1;
      }
      this.cd.markForCheck();
    });
  }

  toggle(id): void {
    this.selectedTab = id;
    // this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
