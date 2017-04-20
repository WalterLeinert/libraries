
import { IUser, User } from '../../src/model';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '../../src/model/generator';
import { MetadataStorage } from '../../src/model/metadata';

import { ServiceFake } from '../../src/testing/service-fake';


/**
 * Simuliert den User-Service
 *
 * @export
 * @class UserServiceFake
 * @extends {ServiceFake<IUser, number>}
 */
export class UserServiceFake extends ServiceFake<IUser, number> {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;

  constructor() {
    super(MetadataStorage.instance.findTableMetadata(User),
      new EntityGenerator<User, number>({
        count: UserServiceFake.ITEMS,
        maxCount: UserServiceFake.MAX_ITEMS,
        tableMetadata: MetadataStorage.instance.findTableMetadata(User),
        idGenerator: new NumberIdGenerator(UserServiceFake.MAX_ITEMS),
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