import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { ConfigService, MetadataService } from '@fluxgate/client';

import { RoleServiceFake } from '../../testing/role-service-fake';
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

  it('should exist', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));


  it('should contain items', inject([RoleService], (service: RoleService) => {
    service.find().subscribe((items) => {
      expect(items.length).toEqual(RoleServiceFake.ITEMS);
    });

  }));
});