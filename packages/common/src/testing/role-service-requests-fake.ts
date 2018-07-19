// fluxgate
import { IRole } from '../model';
import { CrudServiceRequests, Store } from '../redux';
import { EntityVersionServiceFake } from './entity-version-service-fake';
import { RoleServiceFake } from './role-service-fake';

export class RoleServiceRequestsFake extends CrudServiceRequests<IRole, number> {
  constructor(storeId: string, service: RoleServiceFake, store: Store,
    entityVersionServiceFake: EntityVersionServiceFake) {
    super(storeId, service, store, entityVersionServiceFake);
  }
}