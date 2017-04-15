import { Service } from 'ts-express-decorators';

// Fluxgate
import { AppRegistry, IRole, Role } from '@fluxgate/common';
import { Funktion } from '@fluxgate/core';

import { BaseService } from './baseService';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

@Service()
export class RoleService extends BaseService<IRole, number> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(AppRegistry.instance.get<Funktion>(Role.ROLE_CONFIG_KEY), knexSerice, metadataService);
  }
}