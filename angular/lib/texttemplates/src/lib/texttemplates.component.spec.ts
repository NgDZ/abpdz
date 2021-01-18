import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexttemplatesComponent } from './texttemplates.component';

describe('TexttemplatesComponent', () => {
  let component: TexttemplatesComponent;
  let fixture: ComponentFixture<TexttemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TexttemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TexttemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
