// fluxgate
import { IUser } from '../model';
import { ExtendedCrudServiceRequests, Store } from '../redux';
import { EntityVersionServiceFake } from './entity-version-service-fake';
import { UserServiceFake } from './user-service-fake';

export class ExtendedUserServiceRequestsFake extends ExtendedCrudServiceRequests<IUser, number> {
  constructor(storeId: string, service: UserServiceFake, store: Store,
  entityVersionServiceFake: EntityVersionServiceFake) {
    super(storeId, service, store, entityVersionServiceFake);
  }
}