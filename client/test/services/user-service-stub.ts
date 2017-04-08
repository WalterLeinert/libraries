import { Injectable } from '@angular/core';

import { IUser, User } from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';
import { NumberIdGeneratorService } from './number-id-generator.service';
import { ServiceStub } from './service-stub';


/**
 * Simuliert den User-Service
 *
 * @export
 * @class UserServiceStub
 * @extends {ServiceStub<IUser, number>}
 */
@Injectable()
export class UserServiceStub extends ServiceStub<IUser, number> {
  public static readonly MAX_ITEMS = 10;

  constructor(metadataService: MetadataService, idGenerator: NumberIdGeneratorService) {
    super(User, metadataService, idGenerator);
  }

}