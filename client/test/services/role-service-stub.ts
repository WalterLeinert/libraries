import { IRole, Role } from '@fluxgate/common';

import { MetadataService } from '../../src/angular/services/metadata.service';
import { NumberIdGeneratorService } from './number-id-generator.service';
import { ServiceStub } from './service-stub';


/**
 * Simuliert den Role-Service
 *
 * @export
 * @class RoleServiceStub
 * @extends {ServiceStub<IUser, number>}
 */
export class RoleServiceStub extends ServiceStub<IRole, number> {
  public static readonly MAX_ITEMS = 10;

  constructor(metadataService: MetadataService, idGenerator: NumberIdGeneratorService) {
    super(Role, metadataService, idGenerator);
  }

}