import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { ColumnMetadata, FindByIdResult, IEntity, IUser } from '@fluxgate/common';
import { Assert, Clone, Funktion, InvalidOperationException, IToString, Types } from '@fluxgate/core';

import { ISessionRequest } from '../session/session-request.interface';
import { CoreService } from './core-service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';
import { IReadonlyService } from './readonly-service.interface';


/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class ReadonlyService<T extends IEntity<TId>, TId extends IToString> extends CoreService<T, TId>
  implements IReadonlyService<T, TId>  {
  protected static logger = getLogger(ReadonlyService);

  private primaryKeyColumn: ColumnMetadata = null;


  /**
   * Creates an instance of ServiceBase.
   *
   * @param {{ new (): T }} ctor
   * @param {string} _tableName
   * @param {string} _idName
   *
   * @memberOf ServiceBase
   */
  constructor(table: Funktion, knexService: KnexService, metadataService: MetadataService) {
    super(table, knexService, metadataService);

    const cols = this.metadata.columnMetadata.filter((item: ColumnMetadata) => item.options.primary);
    if (cols.length <= 0) {
      ReadonlyService.logger.warn(`Table ${this.metadata.tableName}: no primary key column`);
    }
    this.primaryKeyColumn = cols[0];
  }


  /**
   * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public findById<T extends IEntity<TId>>(
    request: ISessionRequest,
    id: TId
  ): Promise<FindByIdResult<T, TId>> {

    return using(new XLog(ReadonlyService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {

      return new Promise<FindByIdResult<T, TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .where(this.idColumnName, id.toString())
            .transacting(trx)

            .then((rows: any[]) => {
              if (rows.length <= 0) {
                log.info('result: no item found');
                reject(this.createBusinessException(`table ${this.tableName}: item with id ${id} not found.`));
              } else {
                const result = this.createModelInstance(rows[0]) as any as T;

                if (log.isDebugEnabled) {
                  //
                  // falls wir ein User-Objekt gefunden haben, wird für das Logging
                  // die Passwort-Info zurückgesetzt
                  //
                  const logResult = this.createModelInstance(Clone.clone(rows[0]));
                  if (Types.hasMethod(logResult, 'resetCredentials')) {
                    (logResult as any as IUser).resetCredentials();
                  }

                  log.debug('result = ', logResult);
                }

                if (request) {
                  // ggf. id_client der Ergebnis-Row mit der clientId des Users querchecken
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.hasEntityVersionInfo()) {
                  this.findEntityVersionAndResolve(trx, FindByIdResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new FindByIdResult<T, TId>(result, -1));
                }
              }
            })
            .catch((err) => {
              log.error(err);

              trx.rollback();
              reject(this.createSystemException(err));
            });

        });     // transaction
      });     // promise
    });
  }




  /**
   * Liefert den DB-Id-Spaltennamen (primary key column)
   *
   * @readonly
   * @type {string}
   * @memberOf ServiceBase
   */
  public get idColumnName(): string {
    if (!this.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableName}: no primary key column`);
    }
    return this.primaryKeyColumn.options.name;
  }


  /**
   * Setzt die "primary key" Spalte von "aussen". Diese wird als PK-Spalte verwendet, falls über die Metadaten
   * keine primaryKeyColumn definiert ist (kommt aus dem Controller).
   *
   * @param {string} name
   *
   * @memberOf BaseService
   */
  public set idColumnName(name: string) {
    Assert.notNullOrEmpty(name);

    using(new XLog(ReadonlyService.logger, levels.INFO, 'setIdColumn', `name = ${name}`), (log) => {
      if (!this.primaryKeyColumn) {
        const colMetadata = this.metadata.getColumnMetadataByProperty(name);
        if (!colMetadata) {
          const message = `Table ${this.tableName}: no (model) column with name: ${name}`;
          log.error(`message`);
          throw new InvalidOperationException(message);
        }

        log.warn(`Table ${this.tableName}: no primary key column: setting ${name} as primary key column`);
        this.primaryKeyColumn = colMetadata;
      }
    });
  }


  protected addIdSelector(qb: Knex.QueryBuilder, trx: Knex.Transaction, id: any):
    Knex.QueryBuilder {
    return this.addColumnSelector(qb, trx, this.idColumnName, id);
  }
}