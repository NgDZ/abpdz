import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeMaterialComponent } from './theme-material.component';

describe('ThemeMaterialComponent', () => {
  let component: ThemeMaterialComponent;
  let fixture: ComponentFixture<ThemeMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
