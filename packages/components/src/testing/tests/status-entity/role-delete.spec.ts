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



describe('RoleService: should delete by entity status (deleted, archived, ...)', () => {

  let allItems = [];

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
    EntityVersionCache.instance.reset();

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
      allItems = items;
    });
  }));


  it('should delete first item and find items', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.delete(allItems[0]).subscribe((deleteResult) => {

        serviceRequests.find(new StatusFilter(FilterBehaviour.None, EntityStatus.None)).subscribe((items) => {
          expect(items.length).toEqual(RoleServiceFakeService.ITEMS - 1);
        });

        serviceRequests.find(new StatusFilter(FilterBehaviour.Only, EntityStatus.Deleted)).subscribe((items) => {
          expect(items.length).toEqual(1);
        });
      });
    }));

  it('should delete 2nd item and find items', inject([RoleServiceRequests],
    (serviceRequests: RoleServiceRequests) => {
      serviceRequests.delete(allItems[0]).subscribe((deleteResult0) => {
        serviceRequests.delete(allItems[1]).subscribe((deleteResult) => {

          serviceRequests.find(new StatusFilter(FilterBehaviour.None, EntityStatus.None)).subscribe((items) => {
            expect(items.length).toEqual(RoleServiceFakeService.ITEMS - 2);
          });

          serviceRequests.find(new StatusFilter(FilterBehaviour.Only, EntityStatus.Deleted)).subscribe((items) => {
            expect(items.length).toEqual(2);
          });


          // should find all + deleted items (FilterBehaviour.Add, EntityStatus.Deleted)
          serviceRequests.find(new StatusFilter(FilterBehaviour.Add, EntityStatus.Deleted)).subscribe((items) => {
            expect(items.length).toEqual(RoleServiceFakeService.ITEMS);
          });

          // should find all excluding deleted items (FilterBehaviour.Exclude, EntityStatus.Deleted)
          serviceRequests.find(new StatusFilter(FilterBehaviour.Exclude, EntityStatus.Deleted)).subscribe((items) => {
            expect(items.length).toEqual(RoleServiceFakeService.ITEMS - 2);
          });
        });
      });
    }));

});