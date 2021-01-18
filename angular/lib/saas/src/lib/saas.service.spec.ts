import { TestBed } from '@angular/core/testing';

import { SaasService } from './saas.service';

describe('SaasService', () => {
  let service: SaasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
