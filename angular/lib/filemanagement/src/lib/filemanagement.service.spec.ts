import { TestBed } from '@angular/core/testing';

import { FilemanagementService } from './filemanagement.service';

describe('FilemanagementService', () => {
  let service: FilemanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilemanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
