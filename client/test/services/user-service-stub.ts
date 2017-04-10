import { Injectable } from '@angular/core';

import { IUser, User } from '@fluxgate/common';
import { EntityGenerator, NumberIdGenerator } from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';
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
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(User, metadataService,
      new EntityGenerator<User, number>(
        UserServiceStub.ITEMS, UserServiceStub.MAX_ITEMS,
        metadataService.findTableMetadata(User),
        new NumberIdGenerator(UserServiceStub.MAX_ITEMS)
      )
    );
  }

}