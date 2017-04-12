import { Service } from 'ts-express-decorators';


import { BaseService } from '../../../src/ts-express-decorators-flx/services/base.service';
import { KnexService } from '../../../src/ts-express-decorators-flx/services/knex.service';
import { MetadataService } from '../../../src/ts-express-decorators-flx/services/metadata.service';
import { QueryTest } from './query-test';

@Service()
export class QueryTestService extends BaseService<QueryTest, number> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(QueryTest, knexSerice, metadataService);
  }
}