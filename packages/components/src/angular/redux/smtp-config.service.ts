import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, MetadataService } from '@fluxgate/client';
import { ConfigBase, SmtpConfig, TableService } from '@fluxgate/common';

import { ConfigService } from './config.service';
import { SystemConfigService } from './system-config.service';

/**
 * Service für REST-Api den Smtp-Configservice
 *
 * @export
 * @class SmtpConfigService
 * @extends {ConfigService<SmtpConfig>}
 */
@Injectable()
@TableService(ConfigBase)
export class SmtpConfigService extends ConfigService<SmtpConfig> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService,
    systemConfigService: SystemConfigService) {
    super(metadataService, http, configService, systemConfigService);
  }

}