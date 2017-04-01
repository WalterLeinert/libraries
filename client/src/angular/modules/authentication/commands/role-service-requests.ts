import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { IRole } from '@fluxgate/common';


import { AppStore } from '../../../../redux/app-store';
import { EnhancedServiceRequests } from '../../../../redux/enhanced-service-requests';
import { Store } from '../../../../redux/store';
import { RoleService } from '../role.service';
import { RoleStore } from './role-store';


@Injectable()
export class RoleServiceRequests extends EnhancedServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(AppStore) store: Store) {
    super(RoleStore.ID, service, store);
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
    RoleServiceRequests,
    RoleService
  ]
})
export class RoleServiceRequestsModule { }