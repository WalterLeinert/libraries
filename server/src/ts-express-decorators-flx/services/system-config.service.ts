import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { ISystemConfig, SystemConfig } from '@fluxgate/common';

import { BaseService } from './baseService';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';


@Service()
export class SystemConfigService extends BaseService<ISystemConfig, string> {
  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(SystemConfig, knexSerice, metadataService);
  }
}