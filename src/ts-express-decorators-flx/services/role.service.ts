import { Service } from 'ts-express-decorators';

// Fluxgate
import { Role, IRole, AppRegistry } from '@fluxgate/common';

import { MetadataService } from './metadata.service';
import { BaseService } from './base.service';
import { KnexService } from './knex.service';

@Service()
export class RoleService extends BaseService<IRole, number> {

    constructor(knexSerice: KnexService, metadataService: MetadataService) {
        super(AppRegistry.instance.get<Function>(Role.ROLE_CONFIG_KEY), knexSerice, metadataService);
    }
}