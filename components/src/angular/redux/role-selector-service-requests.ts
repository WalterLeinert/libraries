import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';

import { ExtendedCrudServiceRequests, IRole, Store } from '@fluxgate/common';

import { RoleService } from '../modules/authentication/role.service';
import { RoleSelectorStore } from './role-selector-store';


@Injectable()
export class RoleSelectorServiceRequests extends ExtendedCrudServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(APP_STORE) store: Store) {
    super(RoleSelectorStore.ID, service, store);
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