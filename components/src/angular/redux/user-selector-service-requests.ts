import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  CommandStore, ENTITY_VERSION_SERVICE, EntityVersion, ExtendedCrudServiceRequests, GenericStore,
  IService, IUser, Store, UserStore
} from '@fluxgate/common';

import { UserService } from './user.service';

@Injectable()
export class UserSelectorServiceRequests extends ExtendedCrudServiceRequests<IUser, number> {

  constructor(service: UserService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(new GenericStore<IUser, number>(CommandStore.NO_ID), service, store, entityVersionService, UserStore.ID);
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
    UserSelectorServiceRequests,
    UserService
  ]
})
export class UserSelectorServiceRequestsModule { }