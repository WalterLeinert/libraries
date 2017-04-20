// fluxgate
import { IUser } from '../../src/model';
import { ServiceRequests, Store } from '../../src/redux';
import { UserServiceFake } from './user-service-fake';
import { UserStore } from './user-store';


export class UserServiceRequests extends ServiceRequests<IUser, number, UserServiceFake> {

  constructor(service: UserServiceFake, store: Store) {
    super(UserStore.ID, service, store);
  }
}
