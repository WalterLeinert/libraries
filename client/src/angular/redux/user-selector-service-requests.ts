import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { ExtendedCrudServiceRequests, IUser, Store } from '@fluxgate/common';


import { UserService } from '../modules/authentication/user.service';
import { AppStore } from './app-store';
import { UserSelectorStore } from './user-selector-store';


@Injectable()
export class UserSelectorServiceRequests extends ExtendedCrudServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(AppStore) store: Store) {
    super(UserSelectorStore.ID, service, store);
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