// fluxgate
import { IUser } from '../model';
import { ExtendedCrudServiceRequests, Store } from '../redux';
import { UserServiceFake } from './user-service-fake';

export class ExtendedUserServiceRequestsFake extends ExtendedCrudServiceRequests<IUser, number, UserServiceFake> {
  constructor(storeId: string, service: UserServiceFake, store: Store) {
    super(storeId, service, store);
  }
}