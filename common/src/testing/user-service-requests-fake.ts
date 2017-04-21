// fluxgate
import { IUser } from '../model';
import { ServiceRequests, Store } from '../redux';
import { UserServiceFake } from './user-service-fake';

export class UserServiceRequestsFake extends ServiceRequests<IUser, number, UserServiceFake> {
  constructor(storeId: string, service: UserServiceFake, store: Store) {
    super(storeId, service, store);
  }
}