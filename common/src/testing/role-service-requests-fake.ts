// fluxgate
import { IRole } from '../model';
import { ServiceRequests, Store } from '../redux';
import { RoleServiceFake } from './role-service-fake';

export class RoleServiceRequestsFake extends ServiceRequests<IRole, number, RoleServiceFake> {
  constructor(storeId: string, service: RoleServiceFake, store: Store) {
    super(storeId, service, store);
  }
}