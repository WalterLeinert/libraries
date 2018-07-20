// import { InjectionToken } from '@angular/core';

// fluxgate
import { Store } from '@fluxgate/common';

/**
 * Token für den anwendungsweiten Command-Store
 */
// export const AppStore = new InjectionToken<Store>('App.store');
//
// export const STORE_PROVIDER = {
//   provide: AppStore,
//   useFactory: createStore
// };

// TODO: wegen anuglar aot Fehlern in der Anwendung:
// ERROR in Error encountered resolving symbol values statically.Only initialized variables and constants can be
// referenced because the value of this variable is needed by the template compiler
// (position 5:22 in the original .ts file), resolving symbol APP_STORE ...

export const APP_STORE = 'token/fluxgate.client.app-store';

export function createStore(): Store {
  return new Store();
}


export const APP_STORE_PROVIDER = {
  provide: APP_STORE,
  useFactory: createStore
};