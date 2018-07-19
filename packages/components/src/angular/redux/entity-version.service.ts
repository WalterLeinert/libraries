import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// Fluxgate
import { AppConfigService, MetadataService, ReadonlyService } from '@fluxgate/client';
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
export class EntityVersionService extends ReadonlyService<EntityVersion, string> {

  constructor(metadataService: MetadataService, http: HttpClient, configService: AppConfigService) {
    super(EntityVersion, metadataService, http, configService);
  }
}


export const ENTITY_VERSION_SERVICE_PROVIDER = {
  provide: ENTITY_VERSION_SERVICE,
  useClass: EntityVersionService
};