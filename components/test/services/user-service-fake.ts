import { Injectable } from '@angular/core';

import { MetadataService } from '@fluxgate/client';
import { IUser, ServiceFake, User } from '@fluxgate/common';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '@fluxgate/common';


/**
 * Simuliert den User-Service
 *
 * @export
 * @class UserServiceFake
 * @extends {ServiceFake<IUser, number>}
 */
@Injectable()
export class UserServiceFake extends ServiceFake<IUser, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(metadataService.findTableMetadata(User),
      new EntityGenerator<User, number>({
        count: UserServiceFake.ITEMS,
        maxCount: UserServiceFake.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(User),
        idGenerator: new NumberIdGenerator(UserServiceFake.MAX_ITEMS),
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