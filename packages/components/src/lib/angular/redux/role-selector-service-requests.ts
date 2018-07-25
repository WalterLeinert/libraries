import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  CommandStore, ENTITY_VERSION_SERVICE, EntityVersion, ExtendedCrudServiceRequests, GenericStore,
  IRole, IService, RoleStore, Store
} from '@fluxgate/common';

import { RoleService } from './role.service';


@Injectable()
export class RoleSelectorServiceRequests extends ExtendedCrudServiceRequests<IRole, number> {

  constructor(service: RoleService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(new GenericStore<IRole, number>(CommandStore.NO_ID), service, store, entityVersionService, RoleStore.ID);
  }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    RoleSelectorServiceRequests,
    RoleService
  ]
})
export class RoleSelectorServiceRequestsModule { }