import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

// Fluxgate
import { ConfigService, MetadataService, ReadonlyService } from '@fluxgate/client';
import { ENTITY_VERSION_SERVICE, EntityVersion, TableService } from '@fluxgate/common';


/**
 * Service für REST-Api für Entity @see{EntityVersion}.
 *
 * @export
 * @class EntityVersionService
 * @extends {Service<EntityVersion>}
 */
@Injectable()
@TableService(EntityVersion)
export class EntityVersionService extends ReadonlyService<EntityVersion, number> {

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(EntityVersion, metadataService, http, configService);
  }
}


export const ENTITY_VERSION_SERVICE_PROVIDER = {
  provide: ENTITY_VERSION_SERVICE,
  useClass: EntityVersionService
};