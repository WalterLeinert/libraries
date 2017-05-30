// Fluxgate
import { Assert, JsonSerializer } from '@fluxgate/core';

import { IServiceCore } from '../../services/service-core.interface';

/**
 * Abstrakte Basisklasse für alle Controller.
 *
 * @export
 * @abstract
 * @class ControllerCore
 */
export abstract class ControllerCore {
  private serializer: JsonSerializer = new JsonSerializer();


  protected constructor(private _service: IServiceCore) {
    Assert.notNull(_service);
  }


  /**
   * Serialisiert das @param{item} für die Übertragung zum Client über das REST-Api.
   *
   * @param {T} item
   * @returns {any}
   */
  protected serialize<T>(item: T): any {
    Assert.notNull(item);
    return this.serializer.serialize(item);
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Client zum Server übertragen wurde
   *
   * @param {any} json - Json-Objekt vom Client
   * @returns {T}
   *
   */
  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }

  protected getService(): IServiceCore {
    return this._service;
  }
}