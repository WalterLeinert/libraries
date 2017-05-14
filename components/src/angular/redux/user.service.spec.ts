import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// import { MockBackend } from '@angular/http/testing';

import { ConfigService, MetadataService } from '@fluxgate/client';

import {
  ENTITY_VERSION_SERVICE_FAKE_PROVIDER, EntityVersionServiceFakeService
} from '../../testing/entity-version-service-fake.service';
import { USER_SERVICE_FAKE_PROVIDER, UserServiceFakeService } from '../../testing/user-service-fake.service';
import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        MetadataService,
        EntityVersionServiceFakeService,
        ENTITY_VERSION_SERVICE_FAKE_PROVIDER,
        USER_SERVICE_FAKE_PROVIDER
      ]
    });
  });

  it('should exist', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));


  it('should contain items', inject([UserService], (service: UserService) => {
    service.find().subscribe((items) => {
      expect(items.length).toEqual(UserServiceFakeService.ITEMS);
    });

  }));
});
