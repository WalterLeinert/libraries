import { Injectable } from '@angular/core';

import { IUser, User } from '@fluxgate/common';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '@fluxgate/common';

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
      new EntityGenerator<User, number>({
        count: UserServiceStub.ITEMS,
        maxCount: UserServiceStub.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(User),
        idGenerator: new NumberIdGenerator(UserServiceStub.MAX_ITEMS),
        columns: {
          id_mandant: new ConstantValueGenerator(1),
          role: new ConstantValueGenerator(2),
          deleted: new ConstantValueGenerator(false),
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }

}