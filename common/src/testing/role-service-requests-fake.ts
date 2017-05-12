// fluxgate
import { IRole } from '../model';
import { CrudServiceRequests, Store } from '../redux';
import { RoleServiceFake } from './role-service-fake';

export class RoleServiceRequestsFake extends CrudServiceRequests<IRole, number, RoleServiceFake> {
  constructor(storeId: string, service: RoleServiceFake, store: Store) {
    super(storeId, service, store, null /*TODO*/);
  }
}