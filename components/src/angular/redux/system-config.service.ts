import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Fluxgate
import { ConfigService, MetadataService, Service } from '@fluxgate/client';
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

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(SystemConfig, metadataService, http, configService);
  }
}
