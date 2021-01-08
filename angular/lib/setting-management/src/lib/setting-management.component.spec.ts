import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingManagementComponent } from './setting-management.component';

describe('SettingManagementComponent', () => {
  let component: SettingManagementComponent;
  let fixture: ComponentFixture<SettingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
