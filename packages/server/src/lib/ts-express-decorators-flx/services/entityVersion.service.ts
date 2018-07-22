import { Service } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion } from '@fluxgate/common';

import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';
import { ReadonlyService } from './readonly-service';

@Service()
export class EntityVersionService extends ReadonlyService<EntityVersion, string> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(EntityVersion, knexSerice, metadataService);
  }
}