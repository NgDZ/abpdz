import { TestBed } from '@angular/core/testing';

import { ThemeMaterialService } from './theme-material.service';

describe('ThemeMaterialService', () => {
  let service: ThemeMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
