import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// import { MockBackend } from '@angular/http/testing';

import { ConfigService, MetadataService } from '@fluxgate/client';

import { UserServiceFake } from '../../../../test/services/user-service-fake';
import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        MetadataService,
        { provide: UserService, useClass: UserServiceFake }
      ]
    });
  });

  it('should exist', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));



  it('should contain items', inject([UserService], (service: UserService) => {
    service.find().subscribe((items) => {
      expect(items.length).toEqual(UserServiceFake.ITEMS);
    });

  }));
});
