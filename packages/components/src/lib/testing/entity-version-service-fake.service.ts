import { Injectable } from '@angular/core';
import { ENTITY_VERSION_SERVICE, EntityVersionServiceFake } from '@fluxgate/common';


/**
 * Simuliert den EntityVersion-Service
 *
 * Für alle registrierten Entities (MetadataStorage) werden Items generiert
 */
@Injectable()
export class EntityVersionServiceFakeService extends EntityVersionServiceFake {
}

export const ENTITY_VERSION_SERVICE_FAKE_PROVIDER = {
  provide: ENTITY_VERSION_SERVICE, useClass: EntityVersionServiceFakeService
};