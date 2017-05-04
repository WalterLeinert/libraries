import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import { CommandStore, ExtendedCrudServiceRequests, GenericStore, IRole, RoleStore, Store } from '@fluxgate/common';

import { RoleService } from './role.service';


@Injectable()
export class RoleSelectorServiceRequests extends ExtendedCrudServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(APP_STORE) store: Store) {
    super(new GenericStore<IRole, number>(CommandStore.NoId), service, store, RoleStore.ID);
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