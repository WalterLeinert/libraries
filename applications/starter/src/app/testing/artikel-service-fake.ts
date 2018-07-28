import { Injectable } from '@angular/core';

// Fluxgate
import { MetadataService } from '@fluxgate/client';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator, ServiceFake } from '@fluxgate/common';

import { Artikel } from '@fluxgate/starter-common';
import { ArtikelService } from '../services';


/**
 * Simuliert den Artikel-Service
 *
 * @export
 * @class ArtikelServiceFake
 * @extends {ServiceFake<Artikel, number>}
 */
@Injectable()
export class ArtikelServiceFake extends ServiceFake<Artikel, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor(metadataService: MetadataService) {
    super(metadataService.findTableMetadata(Artikel),
      new EntityGenerator<Artikel, number>({
        count: ArtikelServiceFake.ITEMS,
        maxCount: ArtikelServiceFake.MAX_ITEMS,
        tableMetadata: metadataService.findTableMetadata(Artikel),
        idGenerator: new NumberIdGenerator(ArtikelServiceFake.MAX_ITEMS),
        columns: {
          id_client: new ConstantValueGenerator(1),
          deleted: new ConstantValueGenerator(false),
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }

}


export const ARTIKEL_SERVICE_FAKE_PROVIDER = {
  provide: ArtikelService,
  useClass: ArtikelServiceFake
};