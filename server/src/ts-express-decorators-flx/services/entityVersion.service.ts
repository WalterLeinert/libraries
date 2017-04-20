import { Service } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, ServiceResult } from '@fluxgate/common';
import { NotSupportedException } from '@fluxgate/core';

import { BaseService } from './baseService';
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