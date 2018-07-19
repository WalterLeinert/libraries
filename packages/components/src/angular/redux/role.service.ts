import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import { Role, TableService } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{Role}.
 *
 * @export
 * @class RoleService
 * @extends {Service<Role>}
 */
@Injectable()
@TableService(Role)
export class RoleService extends Service<Role, number> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(Role, metadataService, http, configService);
  }
}
