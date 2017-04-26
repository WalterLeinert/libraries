import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { AppStore } from '@fluxgate/client';
import { IUser, Store, UserStore } from '@fluxgate/common';

import { UserService } from '../modules/authentication/user.service';
import { EnhancedServiceRequests } from './enhanced-service-requests';

@Injectable()
export class UserServiceRequests extends EnhancedServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(AppStore) store: Store) {
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