import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { AppStore } from '@fluxgate/client';
import {
  CurrentItemServiceRequests, CurrentUserStore, IUser, Store
} from '@fluxgate/common';

import { UserService } from '../modules/authentication/user.service';


@Injectable()
export class CurrentUserServiceRequests extends CurrentItemServiceRequests<IUser, number> {

  constructor(service: UserService, @Inject(AppStore) store: Store) {
    super(CurrentUserStore.ID, store);
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
    CurrentUserServiceRequests,
    UserService
  ]
})
export class CurrentUserServiceRequestsModule { }