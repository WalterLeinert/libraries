// import { InjectionToken } from '@angular/core';

// fluxgate
import { Store } from '@fluxgate/common';

/**
 * Token für den anwendungsweiten Command-Store
 */
// export const AppStore = new InjectionToken<Store>('App.store');

export const APP_STORE = {
  token: 'App.store'
};

export function createStore(): Store {
  return new Store();
}

// export const STORE_PROVIDER = {
//   provide: AppStore,
//   useFactory: createStore
// };

export const APP_STORE_PROVIDER = {
  provide: APP_STORE,
  useFactory: createStore
};