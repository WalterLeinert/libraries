import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import { IRole, RoleStore, Store } from '@fluxgate/common';


import { RoleService } from '../modules/authentication/role.service';
import { EnhancedServiceRequests } from './enhanced-service-requests';


@Injectable()
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