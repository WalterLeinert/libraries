// tslint:disable:max-classes-per-file

import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';

// Fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  CommandStore, ENTITY_VERSION_SERVICE, EntityVersion, IExtendedCrudServiceState,
  IService, ReduxStore, StatusServiceRequests, Store, TableServiceRequests
} from '@fluxgate/common';


import { Artikel } from '@fluxgate/starter-common';
import { ArtikelService } from '../services';

export const ARTIKEL_SERVICE_REQUESTS =
  new InjectionToken<ArtikelServiceRequests>('token::starter/redux/artikel-service-requests');


/**
 * redux: Die ServiceRequests für den Artikelservice
 *
 * @export
 * @class ArtikelServiceRequests
 * @extends {ServiceRequests<Artikel, number, ArtikelService>}
 */
@Injectable()
@TableServiceRequests(Artikel)
export class ArtikelServiceRequests extends StatusServiceRequests<Artikel, number> {

  constructor(service: ArtikelService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(ArtikelStore.ID, service, store, entityVersionService);
  }
}


/**
 * redux: der zugehörige Store
 *
 * @export
 * @class ArtikelStore
 * @extends {CommandStore<IServiceState<Artikel, number>>}
 */
@ReduxStore()
export class ArtikelStore extends CommandStore<IExtendedCrudServiceState<Artikel, number>> {
  public static ID = 'artikel';

  constructor() {
    super(ArtikelStore.ID, StatusServiceRequests.INITIAL_STATE);
  }
}

export const ARTIKEL_SERVICE_REQUESTS_PROVIDER = {
  provide: ARTIKEL_SERVICE_REQUESTS,
  useClass: ArtikelServiceRequests
};


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    ArtikelServiceRequests,
    ArtikelService
  ]
})
export class ArtikelServiceRequestsModule { }