import { Service } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, NotSupportedException, ServiceResult } from '@fluxgate/common';

import { BaseService } from './base.service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

@Service()
export class EntityVersionService extends BaseService<EntityVersion, string> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(EntityVersion, knexSerice, metadataService);
  }

  public delete(
    id: string
  ): Promise<ServiceResult<string>> {
    throw new NotSupportedException();
  }
}