import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  ENTITY_VERSION_SERVICE,
  EntityVersion, IService, ISystemConfig, StatusServiceRequests, Store, SystemConfig,
  SystemConfigStore, TableServiceRequests
} from '@fluxgate/common';


import { SystemConfigService } from './system-config.service';


@Injectable()
@TableServiceRequests(SystemConfig)
export class SystemConfigServiceRequests extends StatusServiceRequests<ISystemConfig, string> {

  constructor(service: SystemConfigService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(SystemConfigStore.ID, service, store, entityVersionService);
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
    SystemConfigServiceRequests,
    SystemConfigService
  ]
})
export class SystemConfigServiceRequestsModule { }