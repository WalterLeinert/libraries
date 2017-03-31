import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { IUser } from '@fluxgate/common';


import { AppStore } from '../../../../redux/app-store';
import { ServiceRequests } from '../../../../redux/service-requests';
import { Store } from '../../../../redux/store';
import { UserService } from '../user.service';
import { UserStore } from './user-store';

@Injectable()
export class UserServiceRequests extends ServiceRequests<IUser, number, UserService> {

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