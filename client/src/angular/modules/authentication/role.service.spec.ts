import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { RoleServiceFake } from '../../../../test/services/role-service-fake';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { RoleService } from './role.service';

describe('RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        MetadataService,
        { provide: RoleService, useClass: RoleServiceFake }
      ]
    });
  });

  it('should ...', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));
});
