
import { IRole, Role } from '../model';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '../model/generator';
import { MetadataStorage } from '../model/metadata';

import { ServiceFake } from './service-fake';


/**
 * Simuliert den Role-Service
 *
 * @export
 * @class UserServiceFake
 * @extends {ServiceFake<IRole, number>}
 */
export class RoleServiceFake extends ServiceFake<IRole, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor() {
    super(MetadataStorage.instance.findTableMetadata(Role),
      new EntityGenerator<Role, number>({
        count: RoleServiceFake.ITEMS,
        maxCount: RoleServiceFake.MAX_ITEMS,
        tableMetadata: MetadataStorage.instance.findTableMetadata(Role),
        idGenerator: new NumberIdGenerator(RoleServiceFake.MAX_ITEMS),
        columns: {
          id_mandant: new ConstantValueGenerator(1),
          role: new ConstantValueGenerator(2),
          deleted: new ConstantValueGenerator(false),
          __version: new ConstantValueGenerator(0),
        }
      })
    );
  }

}