import { TestBed } from '@angular/core/testing';

import { SettingManagementService } from './setting-management.service';

describe('SettingManagementService', () => {
  let service: SettingManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
