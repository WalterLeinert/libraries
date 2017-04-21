// fluxgate
import { IRole } from '../model';
import { ServiceRequests, Store } from '../redux';
import { RoleServiceFake } from './role-service-fake';
import { RoleStoreFake } from './role-store-fake';


export class RoleServiceRequestsFake extends ServiceRequests<IRole, number, RoleServiceFake> {

  constructor(service: RoleServiceFake, store: Store) {
    super(RoleStoreFake.ID, service, store);
  }
}
