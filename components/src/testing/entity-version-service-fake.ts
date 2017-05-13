import { Injectable } from '@angular/core';

import { MetadataService } from '@fluxgate/client';
import { ENTITY_VERSION_SERVICE, EntityVersion, ServiceFake } from '@fluxgate/common';
import { EntityGenerator, NumberIdGenerator } from '@fluxgate/common';
// import { EntityVersionService } from '../angular/redux/entity-version.service';

/**
 * Simuliert den EntityVersion-Service
 *
 * @export
 * @class EntityVersionServiceFake
 * @extends {ServiceFake<EntityVersion, string>}
 */
@Injectable()
export class EntityVersionServiceFake extends ServiceFake<EntityVersion, string> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(metadataService.findTableMetadata(EntityVersion),
      new EntityGenerator<EntityVersion, string>({
        count: EntityVersionServiceFake.ITEMS,
        maxCount: EntityVersionServiceFake.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(EntityVersion),
        idGenerator: new NumberIdGenerator(EntityVersionServiceFake.MAX_ITEMS),
        columns: {
        }
      })
    );
  }
}

export const ENTITY_VERSION_SERVICE_FAKE_PROVIDER = { provide: ENTITY_VERSION_SERVICE, useClass: EntityVersionServiceFake };