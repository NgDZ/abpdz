import { TestBed } from '@angular/core/testing';

import { DemosService } from './demos.service';

describe('DemosService', () => {
  let service: DemosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
