// tslint:disable:max-classes-per-file

import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';

// Fluxgate
import { APP_STORE } from '@fluxgate/client';
import {
  CommandStore, ENTITY_VERSION_SERVICE, EntityVersion, ExtendedCrudServiceRequests,
  IExtendedCrudServiceState, IService, ReduxStore, Store, TableServiceRequests
} from '@fluxgate/common';


import { Car } from '@fluxgate/starter-common';
import { CarService } from '../services';

export const CAR_SERVICE_REQUESTS =
  new InjectionToken<CarServiceRequests>('token::starter/redux/car-service-requests');


/**
 * redux: Die ServiceRequests für den Carservice
 *
 * @export
 * @class CarServiceRequests
 * @extends {ServiceRequests<Car, number, CarService>}
 */
@Injectable()
@TableServiceRequests(Car)
export class CarServiceRequests extends ExtendedCrudServiceRequests<Car, number> {

  constructor(service: CarService, @Inject(APP_STORE) store: Store,
    @Inject(ENTITY_VERSION_SERVICE) entityVersionService?: IService<EntityVersion, string>) {
    super(CarStore.ID, service, store, entityVersionService);
  }
}


/**
 * redux: der zugehörige Store
 *
 * @export
 * @class CarStore
 * @extends {CommandStore<IServiceState<Car, number>>}
 */
@ReduxStore()
export class CarStore extends CommandStore<IExtendedCrudServiceState<Car, number>> {
  public static ID = 'car';

  constructor() {
    super(CarStore.ID, ExtendedCrudServiceRequests.INITIAL_STATE);
  }
}

export const CAR_SERVICE_REQUESTS_PROVIDER = {
  provide: CAR_SERVICE_REQUESTS,
  useClass: CarServiceRequests
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
    CarServiceRequests,
    CarService
  ]
})
export class CarServiceRequestsModule { }