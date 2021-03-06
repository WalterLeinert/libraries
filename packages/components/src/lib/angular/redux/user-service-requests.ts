import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  ENTITY_VERSION_SERVICE,
  EntityVersion, IService, IUser, StatusServiceRequests, Store, TableServiceRequests, User, UserStore
} from '@fluxgate/common';

import { UserService } from './user.service';

@Injectable()
@TableServiceRequests(User)
export class UserServiceRequests extends StatusServiceRequests<IUser, number> {

  constructor(service: UserService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(UserStore.ID, service, store, entityVersionService);
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