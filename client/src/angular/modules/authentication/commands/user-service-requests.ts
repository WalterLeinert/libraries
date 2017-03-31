// tslint:disable:max-classes-per-file


import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { IUser } from '@fluxgate/common';


import { AppStore } from '../../../../redux/app-store';
import { CommandStore } from '../../../../redux/commandStore';
import { ServiceCommand } from '../../../../redux/service-command';
import { ServiceRequests } from '../../../../redux/service-requests';
import { IServiceState } from '../../../../redux/service-state.interface';
import { Store } from '../../../../redux/store';
import { UserService } from '../user.service';


@Injectable()
export class UserServiceRequests extends ServiceRequests<IUser, number, UserService> {

  constructor(service: UserService, @Inject(AppStore) store: Store) {
    super(UserStore.ID, service, store);
  }
}


export class UserStore extends CommandStore<IServiceState<IUser, number>> {
  public static ID = 'userStore';

  constructor() {
    super(UserStore.ID, ServiceCommand.INITIAL_STATE);
  }
}


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