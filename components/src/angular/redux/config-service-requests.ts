import { Inject, Injectable, NgModule } from '@angular/core';

// fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  ConfigBase,
  ConfigStore,
  ENTITY_VERSION_SERVICE, EntityVersion, IService, IUser, StatusServiceRequests, Store, TableServiceRequests
} from '@fluxgate/common';

import { ConfigServiceProxy } from './config-service-proxy';
import { ConfigService } from './config.service';

@Injectable()
@TableServiceRequests(ConfigBase)
export class ConfigServiceRequests extends StatusServiceRequests<ConfigBase, string> {

  constructor(service: ConfigServiceProxy, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(ConfigStore.ID, service, store, entityVersionService);

    service.setModel('');
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
    ConfigServiceRequests,
    ConfigServiceProxy
  ]
})
export class ConfigServiceRequestsModule { }