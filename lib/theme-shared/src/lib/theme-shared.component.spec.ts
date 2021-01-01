import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSharedComponent } from './theme-shared.component';

describe('ThemeSharedComponent', () => {
  let component: ThemeSharedComponent;
  let fixture: ComponentFixture<ThemeSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
