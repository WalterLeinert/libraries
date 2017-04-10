import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { IUser, Store } from '@fluxgate/common';

import { AppStore } from '../../../../redux/app-store';
import { EnhancedServiceRequests } from '../../../../redux/enhanced-service-requests';


import { UserService } from '../user.service';
import { UserStore } from './user-store';

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