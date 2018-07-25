import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { APP_STORE_PROVIDER, AppConfigService, MetadataService } from '@fluxgate/client';
import { AppConfig, EntityStatus, EntityVersionCache, FilterBehaviour, StatusFilter } from '@fluxgate/common';


import { RoleServiceRequests, RoleServiceRequestsModule } from '../../../angular/redux/role-service-requests';
import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../entity-version-service-fake.service';
import { ROLE_SERVICE_FAKE_PROVIDER, RoleServiceFakeService } from '../../role-service-fake.service';
import { TestHelperModule } from '../../unit-test';




describe('RoleService: should find by entity status (deleted, archived, ...)', () => {

  beforeAll(() => {
    EntityVersionCache.instance.reset();

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


  it('should find items', inject([RoleServiceRequests], (serviceRequests: RoleServiceRequests) => {
    serviceRequests.find().subscribe((items) => {
      expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
    });
  }));

  it('should find items (FilterBehaviour.None, EntityStatus.None)', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.find(new StatusFilter(FilterBehaviour.None, EntityStatus.None)).subscribe((items) => {
        expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
      });
    }));


  it('should find deleted items (FilterBehaviour.None, EntityStatus.Deleted)', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.find(new StatusFilter(FilterBehaviour.Only, EntityStatus.Deleted)).subscribe((items) => {
        expect(items.length).toEqual(0);
      });
    }));

  it('should find deleted items (FilterBehaviour.None, EntityStatus.Archived)', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.find(new StatusFilter(FilterBehaviour.Only, EntityStatus.Archived)).subscribe((items) => {
        expect(items.length).toEqual(0);
      });
    }));

  it('should find all + archived items (FilterBehaviour.Add, EntityStatus.Archived)', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.find(new StatusFilter(FilterBehaviour.Add, EntityStatus.Archived)).subscribe((items) => {
        expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
      });
    }));

  it('should find all + deleted items (FilterBehaviour.Add, EntityStatus.Deleted)', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.find(new StatusFilter(FilterBehaviour.Add, EntityStatus.Deleted)).subscribe((items) => {
        expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
      });
    }));
});