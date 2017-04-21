import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { CurrentUserStore, IUser, ServiceRequests, Store } from '@fluxgate/common';

import { UserService } from '../modules/authentication/user.service';
import { AppStore } from './app-store';

@Injectable()
export class CurrentUserServiceRequests extends ServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(AppStore) store: Store) {
    super(CurrentUserStore.ID, service, store);
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