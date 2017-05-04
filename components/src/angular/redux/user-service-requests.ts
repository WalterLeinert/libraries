import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import { IUser, Store, TableServiceRequests, User, UserStore } from '@fluxgate/common';

import { UserService } from '../modules/authentication/user.service';
import { EnhancedServiceRequests } from './enhanced-service-requests';

@Injectable()
@TableServiceRequests(User)
export class UserServiceRequests extends EnhancedServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(APP_STORE) store: Store) {
    super(UserStore.ID, service, store);
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
    UserServiceRequests,
    UserService
  ]
})
export class UserServiceRequestsModule { }