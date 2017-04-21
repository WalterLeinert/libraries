import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { IRole, Store } from '@fluxgate/common';


import { RoleService } from '../modules/authentication/role.service'
import { AppStore } from './app-store';
import { EnhancedServiceRequests } from './enhanced-service-requests';
import { RoleStore } from './role-store';


@Injectable()
export class RoleServiceRequests extends EnhancedServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(AppStore) store: Store) {
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