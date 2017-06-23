import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { AppConfigService, MetadataService } from '@fluxgate/client';

import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../testing/entity-version-service-fake.service';
import { ROLE_SERVICE_FAKE_PROVIDER, RoleServiceFakeService } from '../../testing/role-service-fake.service';
import { RoleService } from './role.service';

describe('RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigService,
        MetadataService,
        EntityVersionServiceFakeService,
        ENTITY_VERSION_SERVICE_FAKE_PROVIDER,
        ROLE_SERVICE_FAKE_PROVIDER
      ]
    });
  });

  it('should exist', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));


  it('should contain items', inject([RoleService], (service: RoleService) => {
    service.find().subscribe((result) => {
      expect(result.items.length).toEqual(RoleServiceFakeService.ITEMS);
    });

  }));
});
