import { TestBed } from '@angular/core/testing';

import { ThemeSharedService } from './theme-shared.service';

describe('ThemeSharedService', () => {
  let service: ThemeSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
