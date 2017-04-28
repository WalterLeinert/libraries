import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Fluxgate
import { ConfigService, MetadataService, Service } from '@fluxgate/client';
import { Role } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{Role}.
 *
 * @export
 * @class RoleService
 * @extends {Service<Role>}
 */
@Injectable()
export class RoleService extends Service<Role, number> {

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(Role, metadataService, http, configService);
  }
}
