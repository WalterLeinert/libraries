import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import { CommandStore, ExtendedCrudServiceRequests, GenericStore, IUser, Store, UserStore } from '@fluxgate/common';

import { UserService } from '../modules/authentication/user.service';

@Injectable()
export class UserSelectorServiceRequests extends ExtendedCrudServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(APP_STORE) store: Store) {
    super(new GenericStore<IUser, number>(CommandStore.NoId), service, store, UserStore.ID);
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
    UserSelectorServiceRequests
  ]
})
export class UserSelectorServiceRequestsModule { }