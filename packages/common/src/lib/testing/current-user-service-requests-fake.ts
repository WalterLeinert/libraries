// fluxgate
import { IUser } from '../model';
import { CurrentItemServiceRequests, Store } from '../redux';

export class CurrentUserServiceRequestsFake extends CurrentItemServiceRequests<IUser> {
  constructor(storeId: string, unusedService: any, store: Store) {
    super(storeId, store);
  }
}