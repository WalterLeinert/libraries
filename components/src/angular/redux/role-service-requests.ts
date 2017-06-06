import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  EnhancedServiceRequests,
  ENTITY_VERSION_SERVICE, EntityVersion, IRole, IService, Role, RoleStore, Store, TableServiceRequests
} from '@fluxgate/common';


import { RoleService } from './role.service';


@Injectable()
@TableServiceRequests(Role)
export class RoleServiceRequests extends EnhancedServiceRequests<IRole, number> {

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