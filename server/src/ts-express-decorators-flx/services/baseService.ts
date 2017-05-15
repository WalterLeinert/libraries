import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  EntityNotFoundException, Funktion, IToString, OptimisticLockException
} from '@fluxgate/core';

import {
  CreateServiceResult, DeleteServiceResult, UpdateServiceResult
} from '@fluxgate/common';


import { IBaseService } from './baseService.interface';
import { FindService } from './find-service';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';


/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class BaseService<T, TId extends IToString> extends FindService<T, TId>
  implements IBaseService<T, TId>  {
  protected static logger = getLogger(BaseService);

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
  }


  /**
   * Erzeugt eine neue Entity-Instanz vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public create(
    subject: T
  ): Promise<CreateServiceResult<T>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      const dbSubject = this.createDatabaseInstance(subject);

      if (log.isDebugEnabled()) {
        log.debug('dbSubject: ', dbSubject);
      }

      return new Promise<CreateServiceResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .insert(dbSubject)
            .transacting(trx)

            .then((ids: number[]) => {

              if (ids.length <= 0) {
                log.error(`ids empty`);
                reject(this.createSystemException('create failed: ids empty'));
              } else if (ids.length > 1) {
                reject(this.createSystemException('create failed: ids.length > 1'));
              } else {
                const id = ids[0];
                log.debug(`created new ${this.tableName} with id: ${id}`);

                // Id der neuen Instanz zuweisen
                dbSubject[this.idColumnName] = id;

                subject = this.createModelInstance(dbSubject);

                const entityVersion = -1;     // TODO

                trx.commit();
                resolve(new CreateServiceResult(subject, entityVersion));
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
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public update(
    subject: T
  ): Promise<UpdateServiceResult<T>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
      log.debug('subject: ', subject);

      const dbSubject = this.createDatabaseInstance(subject);

      return new Promise<UpdateServiceResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          let delayMillisecs = 0;

          if (this.metadata.testColumn) {
            log.info(`testColumn exists: ${this.metadata.testColumn.propertyName}`);

            const testValue = subject[this.metadata.testColumn.propertyName];
            if (testValue) {
              delayMillisecs = +testValue;
              log.info(`delay = ${delayMillisecs} [ms]`);
            }
          }

          // TODO: setTimeout(() => {

          let query: Knex.QueryBuilder = this.fromTable()
            .where(this.idColumnName, dbSubject[this.idColumnName]);

          // "leere"" query
          let entityversionQuery: Knex.QueryBuilder = this.knexService.knex.table('entityversion');

          /**
           * falls eine Version-Column vorliegt, müssen wir
           * - die Entity-Version in die Query einbauen
           * - und die Version erhöhen
           */
          if (this.metadata.versionColumn) {
            const andWhereColumnName = this.metadata.versionColumn.options.name;

            const version: number = dbSubject[this.metadata.versionColumn.options.name];
            const andWhereValue = version;

            dbSubject[andWhereColumnName] = version + 1;

            query = query.andWhere(andWhereColumnName, '=', andWhereValue);

            log.debug(`query prepared for updating version in table ${this.tableName}`);

            // query zum Inkrement der Version in Tabelle entityversion
            entityversionQuery = this.createEntityVersionIncrement(trx);

            log.debug(`query prepared for updating version in entityversion for table ${this.tableName}`);
          }

          log.debug('dbSbject: ', dbSubject);

          entityversionQuery
            .then((item) => {

              query
                .update(dbSubject)
                .transacting(trx)

                .then((affectedRows: number) => {
                  log.debug(`updated ${this.tableName} with id: ${dbSubject[this.idColumnName]}` +
                    ` (affectedRows: ${affectedRows})`, );

                  if (this.metadata.versionColumn) {
                    if (affectedRows <= 0) {
                      trx.rollback();

                      const exc = new OptimisticLockException(
                        `table: ${this.tableName}, id: ${dbSubject[this.idColumnName]}`);

                      log.error(exc);
                      reject(exc);
                    } else {

                      subject = this.createModelInstance(dbSubject);

                      const entityVersion = -1;     // TODO

                      trx.commit();

                      log.debug('subject after commit: ', subject);
                      resolve(new UpdateServiceResult(subject, entityVersion));
                    }
                  } else {
                    if (affectedRows <= 0) {
                      trx.rollback();

                      const exc = new EntityNotFoundException(
                        `table: ${this.tableName}, id: ${dbSubject[this.idColumnName]}`);
                      log.error(exc);

                      reject(exc);
                    } else {
                      subject = this.createModelInstance(dbSubject);

                      const entityVersion = -1;     // TODO

                      trx.commit();

                      log.debug('subject after commit: ', subject);
                      resolve(new UpdateServiceResult(subject, entityVersion));
                    }
                  }
                })
                .catch((err) => {
                  log.error(err);

                  trx.rollback();
                  reject(this.createSystemException(err));
                });
              //  }, delayMillisecs);
            });

        });     // transaction
      });     // promise
    });
  }


  /**
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   *
   * @memberOf ServiceBase
   */
  public delete(
    id: TId
  ): Promise<DeleteServiceResult<TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
      return new Promise<DeleteServiceResult<TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          this.fromTable()
            .where(this.idColumnName, id.toString())
            .del()
            .transacting(trx)

            .then((affectedRows: number) => {
              log.debug(`deleted from ${this.tableName} with id: ${id} (affectedRows: ${affectedRows})`);

              if (affectedRows <= 0) {
                trx.rollback();
                reject(this.createSystemException(
                  new EntityNotFoundException(`table: ${this.tableName}, id: ${id}`)));
              } else {
                const entityVersion = -1;     // TODO

                trx.commit();
                resolve(new DeleteServiceResult(id, entityVersion));
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




  protected createDatabaseInstance(entity: T): any {
    return this.metadata.createDatabaseInstance<T>(entity);
  }



  /**
   * Liefert eine Query, die für die aktuelle Transaktion @param{trx} und Tabelle die
   * Version in der Tabelle 'entityversion' um eins erhöht.
   *
   * @private
   * @param {Knex.Transaction} trx
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  private createEntityVersionIncrement(trx: Knex.Transaction): Knex.QueryBuilder {
    return this.knexService.knex.table('entityversion')
      .where('entityversion_id', '=', this.tableName)
      .increment('entityversion_version', 1)
      .transacting(trx);
  }


}