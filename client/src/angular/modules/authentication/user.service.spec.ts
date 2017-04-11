import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { UserServiceFake } from '../../../../test/services/user-service-fake';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
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
