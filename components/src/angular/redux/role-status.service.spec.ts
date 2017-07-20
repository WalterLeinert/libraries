import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { APP_STORE_PROVIDER, AppConfigService, MetadataService } from '@fluxgate/client';
import { AppConfig } from '@fluxgate/common';


import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../testing/entity-version-service-fake.service';
import { ROLE_SERVICE_FAKE_PROVIDER, RoleServiceFakeService } from '../../testing/role-service-fake.service';
import {
  ROLE_SERVICE_REQUESTS_FAKE_PROVIDER,
  RoleServiceRequestsFake, RoleServiceRequestsFakeModule
} from '../../testing/role-service-requests-fake.service';
import { TestHelperModule } from '../../testing/unit-test';
import { RoleServiceRequests, RoleServiceRequestsModule } from './role-service-requests';




describe('RoleService: should test entity status (deleted, archived, ...)', () => {

  beforeAll(() => {
    AppConfig.register({
      url: 'unused',
      printUrl: 'unused',
      printTopic: 'unused',
      mode: 'development',
      proxyMode: 'entityVersion'
    });
  });

  afterAll(() => {
    AppConfig.unregister();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestHelperModule,
        RoleServiceRequestsModule
      ],
      providers: [
        APP_STORE_PROVIDER,
        AppConfigService,
        MetadataService,
        EntityVersionServiceFakeService,
        ROLE_SERVICE_FAKE_PROVIDER,
        ENTITY_VERSION_SERVICE_FAKE_PROVIDER
      ]
    });
  });


  it('should exist', inject([RoleServiceRequests], (serviceRequests: RoleServiceRequests) => {
    expect(serviceRequests).toBeTruthy();
  }));


  it('should contain items', inject([RoleServiceRequests], (serviceRequests: RoleServiceRequests) => {
    serviceRequests.find().subscribe((items) => {
      expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
    });
  }));
});
