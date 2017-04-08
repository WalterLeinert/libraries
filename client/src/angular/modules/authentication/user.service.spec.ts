import { inject, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
// cd climport { MockBackend } from '@angular/http/testing';

import { NumberIdGeneratorService } from '../../../../test/services/number-id-generator.service';
import { UserServiceStub } from '../../../../test/services/user-service-stub';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        MetadataService,
        NumberIdGeneratorService,
        { provide: UserService, useClass: UserServiceStub }
      ]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
