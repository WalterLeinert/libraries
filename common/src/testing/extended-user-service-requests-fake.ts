// fluxgate
import { IUser } from '../model';
import { ExtendedCrudServiceRequests, Store } from '../redux';
import { UserServiceFake } from './user-service-fake';

export class ExtendedUserServiceRequestsFake extends ExtendedCrudServiceRequests<IUser, number> {
  constructor(storeId: string, service: UserServiceFake, store: Store) {
    super(storeId, service, store, null /*TODO*/);
  }
}