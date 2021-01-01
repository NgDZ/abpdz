import { TestBed } from '@angular/core/testing';

import { PermissionManagementService } from './permission-management.service';

describe('PermissionManagementService', () => {
  let service: PermissionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
