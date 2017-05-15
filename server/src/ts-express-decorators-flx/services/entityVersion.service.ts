import { Service } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion } from '@fluxgate/common';

import { FindService } from './find-service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

@Service()
export class EntityVersionService extends FindService<EntityVersion, string> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(EntityVersion, knexSerice, metadataService);
  }
}