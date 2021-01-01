import { TestBed } from '@angular/core/testing';

import { ThemeBasicService } from './theme-basic.service';

describe('ThemeBasicService', () => {
  let service: ThemeBasicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeBasicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
