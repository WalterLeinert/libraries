// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert, JsonSerializer } from '@fluxgate/core';


/**
 * Abstrakte Basisklasse für alle Controller.
 *
 * @export
 * @abstract
 * @class ControllerCore
 */
export abstract class ControllerCore {
  protected static logger = getLogger(ControllerCore);

  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private _tableName: string, private _idName: string) {
    Assert.notNullOrEmpty(_tableName);
    Assert.notNullOrEmpty(_idName);
  }


  /**
   * Serialisiert das @param{item} für die Übertragung zum Client über das REST-Api.
   *
   * @param {any} item
   * @returns {any}
   */
  protected serialize<TSerialize>(item: TSerialize): any {
    Assert.notNull(item);
    return this.serializer.serialize(item);
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Client zum Server übertragen wurde
   *
   * @param {any} json - Json-Objekt vom Client
   * @returns {any}
   *
   */
  protected deserialize<TSerialize>(json: any): TSerialize {
    Assert.notNull(json);
    return this.serializer.deserialize<TSerialize>(json);
  }



  /**
   * Liefert den zugehörigen Tabellennamen
   *
   * @readonly
   * @protected
   * @type {string}
   * @memberOf ControllerBase
   */
  protected get tableName(): string {
    return this._tableName;
  }

  /**
   * Liefert den zugehörigen PrimaryKey-Tabellenspaltennamen.
   *
   * @readonly
   * @protected
   * @type {string}
   * @memberOf ControllerBase
   */
  protected get idName(): string {
    return this._idName;
  }

}