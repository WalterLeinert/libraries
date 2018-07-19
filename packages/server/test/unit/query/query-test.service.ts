import { Service } from 'ts-express-decorators';

import { QueryTest } from '@fluxgate/common';


import { BaseService } from '../../../src/ts-express-decorators-flx/services/baseService';
import { KnexService } from '../../../src/ts-express-decorators-flx/services/knex.service';
import { MetadataService } from '../../../src/ts-express-decorators-flx/services/metadata.service';


@Service()
export class QueryTestService extends BaseService<QueryTest, number> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(QueryTest, knexSerice, metadataService);
  }
}