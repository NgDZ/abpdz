import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilemanagementComponent } from './filemanagement.component';

describe('FilemanagementComponent', () => {
  let component: FilemanagementComponent;
  let fixture: ComponentFixture<FilemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
