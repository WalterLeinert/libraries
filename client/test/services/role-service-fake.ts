import { Injectable } from '@angular/core';

import { IRole, Role, ServiceFake } from '@fluxgate/common';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';


/**
 * Simuliert den Role-Service
 *
 * @export
 * @class RoleServiceFake
 * @extends {ServiceFake<IUser, number>}
 */
@Injectable()
export class RoleServiceFake extends ServiceFake<IRole, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(metadataService.findTableMetadata(Role),
      new EntityGenerator<Role, number>({
        count: RoleServiceFake.ITEMS,
        maxCount: RoleServiceFake.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(Role),
        idGenerator: new NumberIdGenerator(RoleServiceFake.MAX_ITEMS),
        columns: {
          id_mandant: new ConstantValueGenerator(1),
          deleted: new ConstantValueGenerator(false),
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }

}