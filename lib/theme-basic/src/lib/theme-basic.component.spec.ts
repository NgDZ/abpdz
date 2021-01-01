import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeBasicComponent } from './theme-basic.component';

describe('ThemeBasicComponent', () => {
  let component: ThemeBasicComponent;
  let fixture: ComponentFixture<ThemeBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
