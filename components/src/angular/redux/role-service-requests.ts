import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import { IRole, Role, RoleStore, Store, TableServiceRequests } from '@fluxgate/common';


import { RoleService } from '../modules/authentication/role.service';
import { EnhancedServiceRequests } from './enhanced-service-requests';


@Injectable()
@TableServiceRequests(Role)
export class RoleServiceRequests extends EnhancedServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(APP_STORE) store: Store) {
    super(RoleStore.ID, service, store);
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