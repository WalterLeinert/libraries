import { Service } from 'ts-express-decorators';

// Fluxgate
import { AppRegistry, Funktion, IRole, Role } from '@fluxgate/common';

import { BaseService } from './base.service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

@Service()
export class RoleService extends BaseService<IRole, number> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(AppRegistry.instance.get<Funktion>(Role.ROLE_CONFIG_KEY), knexSerice, metadataService);
  }
}