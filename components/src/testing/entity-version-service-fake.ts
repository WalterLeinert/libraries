import { Injectable } from '@angular/core';

import { MetadataService } from '@fluxgate/client';
import { ENTITY_VERSION_SERVICE, EntityVersion, ServiceFake } from '@fluxgate/common';
import { ConstantValueGenerator, EntityGenerator, StringIdListGenerator } from '@fluxgate/common';
// import { EntityVersionService } from '../angular/redux/entity-version.service';

/**
 * Simuliert den EntityVersion-Service
 *
 * Für alle registrierten Entities (MetadataStorage) werden Items generiert
 *
 * @export
 * @class EntityVersionServiceFake
 * @extends {ServiceFake<EntityVersion, string>}
 */
@Injectable()
export class EntityVersionServiceFake extends ServiceFake<EntityVersion, string> {

  constructor(metadataService: MetadataService) {
    super(metadataService.findTableMetadata(EntityVersion),
      new EntityGenerator<EntityVersion, string>({
        count: metadataService.tableMetadata.length,
        maxCount: metadataService.tableMetadata.length,
        tableMetadata: metadataService.findTableMetadata(EntityVersion),
        idGenerator: new StringIdListGenerator(metadataService.tableMetadata.map((item) => item.name)),
        columns: {
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }
}

export const ENTITY_VERSION_SERVICE_FAKE_PROVIDER = { provide: ENTITY_VERSION_SERVICE, useClass: EntityVersionServiceFake };