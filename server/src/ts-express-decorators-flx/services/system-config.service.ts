import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry, ISystemConfig, SystemConfig } from '@fluxgate/common';

import { Messages } from '../../resources/messages';
import { ISessionRequest } from '../session/session-request.interface';
import { BaseService } from './baseService';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

import { Assert, Encryption, Funktion, IQuery, SelectorTerm, Types } from '@fluxgate/core';

@Service()
export class SystemConfigService extends BaseService<ISystemConfig, any> {
  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(SystemConfig, knexSerice, metadataService);
  }
}