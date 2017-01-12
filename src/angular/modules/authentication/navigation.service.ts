import { Injectable } from '@angular/core';

// Fluxgate
import { AppRegistry } from '@fluxgate/common';

/**
 * Service zum Setzen und Abfragen des Navigationspfades in der Anwendung nach Login/Registrierung
 * 
 * @export
 * @class NavigationService
 */
@Injectable()
export class NavigationService {
    public static readonly NAVIGATION_PATH_KEY = 'NavigationService.NavigationPath';

    private _navigationPath: string;

    constructor() {
      this._navigationPath = AppRegistry.instance.get<string>(NavigationService.NAVIGATION_PATH_KEY);
      if (! this._navigationPath) {
          throw new Error(`Key ${NavigationService.NAVIGATION_PATH_KEY} not found in AppRegistry.`);
      }
    }

    public get navigationPath(): string {
        return this._navigationPath;
    }
}
