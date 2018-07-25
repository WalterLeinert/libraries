import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import { SystemConfig, TableService } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{SystemConfig}.
 */
@Injectable()
@TableService(SystemConfig)
export class SystemConfigService extends Service<SystemConfig, string> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(SystemConfig, metadataService, http, configService);
  }
}