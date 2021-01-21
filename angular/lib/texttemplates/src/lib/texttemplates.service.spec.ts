import { TestBed } from '@angular/core/testing';

import { TexttemplatesService } from './texttemplates.service';

describe('TexttemplatesService', () => {
  let service: TexttemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TexttemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
