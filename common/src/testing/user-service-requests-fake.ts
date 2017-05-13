// fluxgate
import { IUser } from '../model';
import { CrudServiceRequests, Store } from '../redux';
import { UserServiceFake } from './user-service-fake';

export class UserServiceRequestsFake extends CrudServiceRequests<IUser, number> {
  constructor(storeId: string, service: UserServiceFake, store: Store) {
    super(storeId, service, store, null /*TODO*/);
  }
}