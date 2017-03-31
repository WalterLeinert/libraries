import { Injectable, Injector, OpaqueToken } from '@angular/core';

import { Funktion, InvalidOperationException, Types, UniqueIdentifiable } from '@fluxgate/common';

@Injectable()
export class AppInjector extends UniqueIdentifiable {
  private static readonly _instance = new AppInjector();
  private static instanceId: number;
  private injector: Injector;

  private constructor() {
    super();

    if (!Types.isPresent(AppInjector.instanceId)) {
      AppInjector.instanceId = this.instanceId;
    } else {
      throw new InvalidOperationException(`Instance already exists.`);
    }
  }

  /**
    * Liefert die Singleton-Instanz.
    * 
    * @readonly
    * @static
    * @type {MetadataStorage}
    * @memberOf MetadataStorage
    */
  public static get instance(): AppInjector {
    return AppInjector._instance;
  }

  public setInjector(injector: Injector) {
    this.injector = injector;
  }

  public getInjector(): Injector {
    return this.injector;
  }

  public getInstance<T>(token: Funktion | OpaqueToken): T {
    const obj = this.injector.get(token) as T;
    return obj;
  }

}