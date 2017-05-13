import { EntityVersion } from '../model';
import { ConstantValueGenerator, EntityGenerator, StringIdListGenerator } from '../model/generator';
import { MetadataStorage } from '../model/metadata';
import { ServiceFake } from './service-fake';

/**
 * Simuliert den EntityVersion-Service
 *
 * Für alle registrierten Entities (MetadataStorage) werden Items generiert
 *
 * @export
 * @class EntityVersionServiceFake
 * @extends {ServiceFake<EntityVersion, string>}
 */
export class EntityVersionServiceFake extends ServiceFake<EntityVersion, string> {
  public static instance = new EntityVersionServiceFake();

  constructor() {
    super(MetadataStorage.instance.findTableMetadata(EntityVersion),
      new EntityGenerator<EntityVersion, string>({
        count: MetadataStorage.instance.tableMetadata.length,
        maxCount: MetadataStorage.instance.tableMetadata.length,
        tableMetadata: MetadataStorage.instance.findTableMetadata(EntityVersion),
        idGenerator: new StringIdListGenerator(MetadataStorage.instance.tableMetadata.map((item) => item.tableName)),
        columns: {
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }
}