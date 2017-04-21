import { InjectionToken } from '@angular/core';

// fluxgate
import { Store } from '@fluxgate/common';

/**
 * Token für den anwendungsweiten Command-Store
 */
export const AppStore = new InjectionToken<Store>('App.store');