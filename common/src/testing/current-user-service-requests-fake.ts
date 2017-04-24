// fluxgate
import { IUser } from '../model';
import { CurrentItemServiceRequests, Store } from '../redux';

export class CurrentUserServiceRequestsFake extends CurrentItemServiceRequests<IUser, number> {
  constructor(storeId: string, store: Store) {
    super(storeId, store);
  }
}