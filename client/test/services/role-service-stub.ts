import { IRole, Role } from '@fluxgate/common';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';
import { ServiceStub } from './service-stub';


/**
 * Simuliert den Role-Service
 *
 * @export
 * @class RoleServiceStub
 * @extends {ServiceStub<IUser, number>}
 */
export class RoleServiceStub extends ServiceStub<IRole, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(Role, metadataService,
      new EntityGenerator<Role, number>({
        count: RoleServiceStub.ITEMS,
        maxCount: RoleServiceStub.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(Role),
        idGenerator: new NumberIdGenerator(RoleServiceStub.MAX_ITEMS),
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