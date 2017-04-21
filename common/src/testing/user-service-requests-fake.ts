// fluxgate
import { IUser } from '../model';
import { ServiceRequests, Store } from '../redux';
import { UserServiceFake } from './user-service-fake';
import { UserStoreFake } from './user-store-fake';


export class UserServiceRequestsFake extends ServiceRequests<IUser, number, UserServiceFake> {

  constructor(service: UserServiceFake, store: Store) {
    super(UserStoreFake.ID, service, store);
  }
}
