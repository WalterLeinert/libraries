import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  ENTITY_VERSION_SERVICE,
  EntityVersion, IRole, IService, Role, RoleStore, StatusServiceRequests, Store, TableServiceRequests
} from '@fluxgate/common';


import { RoleService } from './role.service';


@Injectable()
@TableServiceRequests(Role)
export class RoleServiceRequests extends StatusServiceRequests<IRole, number> {

  constructor(service: RoleService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(RoleStore.ID, service, store, entityVersionService);
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
    RoleServiceRequests,
    RoleService
  ]
})
export class RoleServiceRequestsModule { }