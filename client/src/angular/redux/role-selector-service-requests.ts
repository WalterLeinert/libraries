import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { ExtendedCrudServiceRequests, IRole, Store } from '@fluxgate/common';


import { RoleService } from '../modules/authentication/role.service';
import { AppStore } from './app-store';
import { RoleSelectorStore } from './role-selector-store';


@Injectable()
export class RoleSelectorServiceRequests extends ExtendedCrudServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(AppStore) store: Store) {
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