// tslint:disable:max-classes-per-file


import { Inject, Injectable } from '@angular/core';

// fluxgate
import { IRole } from '@fluxgate/common';


import { AppStore } from '../../../../redux/app-store';
import { CommandStore } from '../../../../redux/commandStore';
import { ServiceCommand } from '../../../../redux/service-command';
import { ServiceRequests } from '../../../../redux/service-requests';
import { IServiceState } from '../../../../redux/service-state.interface';
import { Store } from '../../../../redux/store';
import { RoleService } from '../role.service';


@Injectable()
export class RoleServiceRequests extends ServiceRequests<IRole, number, RoleService> {

  constructor(service: RoleService, @Inject(AppStore) store: Store) {
    super(RoleStore.ID, service, store);
  }
}


export class RoleStore extends CommandStore<IServiceState<IRole, number>> {
  public static ID = 'roleStore';

  constructor() {
    super(RoleStore.ID, ServiceCommand.INITIAL_STATE);
  }
}