
import { IUser, User } from '../model';
import { ConstantValueGenerator, EntityGenerator, NumberIdGenerator } from '../model/generator';
import { MetadataStorage } from '../model/metadata';
import { EntityVersionServiceFake } from './entity-version-service-fake';
import { ServiceFake } from './service-fake';


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

  constructor(entityVersionServiceFake: EntityVersionServiceFake) {
    super(MetadataStorage.instance.findTableMetadata(User),
      new EntityGenerator<User, number>({
        count: UserServiceFake.ITEMS,
        maxCount: UserServiceFake.MAX_ITEMS,
        tableMetadata: MetadataStorage.instance.findTableMetadata(User),
        idGenerator: new NumberIdGenerator(UserServiceFake.MAX_ITEMS),
        columns: {
          role: new ConstantValueGenerator(2),
          __client: new ConstantValueGenerator(1),
          __version: new ConstantValueGenerator(0),
          __deleted: new ConstantValueGenerator(false),
          __archived: new ConstantValueGenerator(false)
        }
      }), entityVersionServiceFake
    );
  }

}