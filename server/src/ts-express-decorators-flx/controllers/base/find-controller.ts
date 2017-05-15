// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindByIdResult, FindResult, QueryResult } from '@fluxgate/common';
import { Assert, IQuery, IToString, JsonSerializer } from '@fluxgate/core';

import { IFindService } from '../../services/find-service.interface';

/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (find, findById, query)
 * oder auf DB-Views arbeiten.
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class FindController
 * @template T      - Entity-Typ
 * @template TId    - Typ der Id-Spalte
 */
export abstract class FindController<T, TId extends IToString> {
  protected static logger = getLogger(FindController);

  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private _service: IFindService<T, TId>, private _tableName: string, private _idName: string) {
    Assert.notNull(_service);
    Assert.notNullOrEmpty(_tableName);
    Assert.notNullOrEmpty(_idName);

    this._service.idColumnName = this._idName;
  }


  /**
   * Liefert eine Entity vom Typ {T} für die angegebene id.
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ControllerBase
   */
  protected findByIdInternal(
    id: TId
  ): Promise<FindByIdResult<T, TId>> {
    return new Promise<FindByIdResult<T, TId>>((resolve, reject) => {
      this.service.findById(id).then((item) => {
        resolve(this.serialize(item));
      });
    });
  }


  /**
   * Liefert alle Entities vom Typ {T}.
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ControllerBase
   */
  protected findInternal(
  ): Promise<FindResult<T>> {
    return new Promise<FindResult<T>>((resolve, reject) => {
      this.service.find().then((items) => {
        resolve(this.serialize(items));
      });
    });
  }


  /**
   * Liefert alle Entities vom Typ {T} über die Query @param{query}.
   *
   * @protected
   * @param {IQuery} query
   * @returns {Promise<T[]>}
   *
   * @memberof ControllerBase
   */
  protected queryInternal(
    query: IQuery
  ): Promise<QueryResult<T>> {
    return new Promise<QueryResult<T>>((resolve, reject) => {
      const deserializedQuery = this.serializer.deserialize<IQuery>(query);

      this.service.query(deserializedQuery).then((result) => {
        resolve(this.serialize(result));
      });
    });
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

  protected get service(): IFindService<T, TId> {
    return this._service;
  }
}