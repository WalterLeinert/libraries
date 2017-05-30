import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  CurrentItemServiceRequests, CurrentUserStore, IUser, Store
} from '@fluxgate/common';

import { UserService } from './user.service';


@Injectable()
export class CurrentUserServiceRequests extends CurrentItemServiceRequests<IUser> {

  constructor(service: UserService, @Inject(APP_STORE) store: Store) {
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