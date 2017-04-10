import { IRole, Role } from '@fluxgate/common';
import { EntityGenerator, NumberIdGenerator } from '@fluxgate/common';

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
      new EntityGenerator<Role, number>(
        RoleServiceStub.ITEMS, RoleServiceStub.MAX_ITEMS,
        metadataService.findTableMetadata(Role),
        new NumberIdGenerator(RoleServiceStub.MAX_ITEMS)
      )
    );
  }
}