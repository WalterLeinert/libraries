// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FindByIdResult, FindResult, IEntity, QueryResult } from '@fluxgate/common';
import { Assert, IQuery, IToString, JsonSerializer } from '@fluxgate/core';

import { IReadonlyService } from '../../services/readonly-service.interface';
import { IBodyRequest } from '../../session/body-request.interface';
import { ISessionRequest } from '../../session/session-request.interface';


/**
 * Abstrakte Basisklasse für alle REST-Controller, die nur lesende Zugriffe durchführen (find, findById, query)
 * oder auf DB-Views arbeiten.
 *
 * Delegiert alle Controller-Calls an den zugehörigen Service @see{TId}.
 *
 * @export
 * @abstract
 * @class ReadonlyController
 * @template T      - Entity-Typ
 * @template TId    - Typ der Id-Spalte
 */
export abstract class ReadonlyController<T, TId extends IToString> {
  protected static logger = getLogger(ReadonlyController);

  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private _service: IReadonlyService<T, TId>, private _tableName: string, private _idName: string) {
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
  protected findByIdInternal<T extends IEntity<TId>>(
    request: ISessionRequest,
    id: TId
  ): Promise<FindByIdResult<T, TId>> {
    return new Promise<FindByIdResult<T, TId>>((resolve, reject) => {
      this._service.findById(request, id).then((item) => {
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
    request: ISessionRequest,
  ): Promise<FindResult<T>> {
    return new Promise<FindResult<T>>((resolve, reject) => {
      this._service.find(request).then((items) => {
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
    request: IBodyRequest<IQuery>
  ): Promise<QueryResult<T>> {
    return new Promise<QueryResult<T>>((resolve, reject) => {
      const deserializedQuery = this.serializer.deserialize<IQuery>(request.body);

      this._service.query(request, deserializedQuery).then((result) => {
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

  protected getService(): IReadonlyService<T, TId> {
    return this._service;
  }
}