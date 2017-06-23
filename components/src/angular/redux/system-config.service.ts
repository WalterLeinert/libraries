import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import { SystemConfig, TableService } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{SystemConfig}.
 *
 * @export
 * @class SystemConfigService
 * @extends {Service<SystemConfig>}
 */
@Injectable()
@TableService(SystemConfig)
export class SystemConfigService extends Service<SystemConfig, string> {

  constructor(metadataService: MetadataService, http: Http, configService: AppConfigService) {
    super(SystemConfig, metadataService, http, configService);
  }
}
