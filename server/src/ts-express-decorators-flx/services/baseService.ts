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
  CreateResult, DeleteResult, IEntity, UpdateResult
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
export abstract class BaseService<T extends IEntity<TId>, TId extends IToString> extends FindService<T, TId>
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
  ): Promise<CreateResult<T, TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      if (this.metadata.versionColumn) {
        subject[this.metadata.versionColumn.name] = 0;    // TODO: Konstante
      }

      const dbSubject = this.createDatabaseInstance(subject);

      if (log.isDebugEnabled()) {
        log.debug('dbSubject: ', dbSubject);
      }

      return new Promise<CreateResult<T, TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          let query: Knex.QueryBuilder = this.fromTable();

          // query für Inkrement der EntityVersion Tabelle oder nop-query erzeugen
          let entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);


          entityversionQuery
            .then((item) => {

              query
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

                    if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                      this.findEntityVersionAndResolve(trx, CreateResult, subject, resolve);
                    } else {
                      trx.commit();

                      log.debug('subject after commit: ', subject);
                      resolve(new CreateResult(subject, -1));
                    }
                  }
                })
                .catch((err) => {
                  log.error(err);

                  trx.rollback();
                  reject(this.createSystemException(err));
                });
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
  ): Promise<UpdateResult<T, TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
      log.debug('subject: ', subject);

      const dbSubject = this.createDatabaseInstance(subject);

      return new Promise<UpdateResult<T, TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          // quer< zur Selektion der Entity und ggf. des Versionsinkrements
          let query: Knex.QueryBuilder = this.createUpdateQuery(trx, dbSubject);

          // query für increment der entityversion Tabelle oder nop-query erzeugen
          let entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);


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

                      if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                        this.findEntityVersionAndResolve(trx, UpdateResult, subject, resolve);
                      } else {

                        trx.commit();

                        log.debug('subject after commit (optimistic lock detection): ', subject);
                        resolve(new UpdateResult(subject, -1));
                      }
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

                      if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                        this.findEntityVersionAndResolve(trx, UpdateResult, subject, resolve);
                      } else {

                        trx.commit();

                        log.debug('subject after commit: ', subject);
                        resolve(new UpdateResult(subject, -1));
                      }

                    }
                  }
                })
                .catch((err) => {
                  log.error(err);

                  trx.rollback();
                  reject(this.createSystemException(err));
                });
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
  ): Promise<DeleteResult<TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
      return new Promise<DeleteResult<TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          let query: Knex.QueryBuilder = this.createSelectorQuery(trx, id);

          // query für increment der entityversion Tabelle oder nop-query erzeugen
          let entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);


          entityversionQuery
            .then((item) => {

              query
                .del()
                .transacting(trx)

                .then((affectedRows: number) => {
                  log.debug(`deleted from ${this.tableName} with id: ${id} (affectedRows: ${affectedRows})`);

                  if (affectedRows <= 0) {
                    trx.rollback();
                    reject(this.createSystemException(
                      new EntityNotFoundException(`table: ${this.tableName}, id: ${id}`)));
                  } else {

                    if (this.entityVersionMetadata && this.entityVersionMetadata !== this.metadata) {
                      this.findEntityVersionAndResolve(trx, DeleteResult, id, resolve);
                    } else {

                      trx.commit();

                      log.debug('delete id after commit: ', id);
                      resolve(new DeleteResult(id, -1));
                    }
                  }
                })
                .catch((err) => {
                  log.error(err);

                  trx.rollback();
                  reject(this.createSystemException(err));
                });
            });
        });     // transaction
      });     // promise
    });
  }


  protected createDatabaseInstance(entity: T): any {
    return this.metadata.createDatabaseInstance<T>(entity);
  }


  /**
   * Liefert eine Query, die über die id-Column eine Entity selektiert und die Version inkrementiert,
   * falls dies eine versionierte Entity ist.
   *
   * @private
   * @param {Knex.Transaction} trx
   * @param {*} dbSubject
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  private createUpdateQuery(trx: Knex.Transaction, dbSubject: any): Knex.QueryBuilder {
    return using(new XLog(BaseService.logger, levels.INFO, 'createSelectorQuery'), (log) => {

      // Selektion der Entity
      let query: Knex.QueryBuilder = this.knexService.knex.table(this.tableName)
        .where(this.idColumnName, dbSubject[this.idColumnName]);

      //
      // falls eine Version-Column vorliegt, müssen wir die Version erhöhen
      //
      if (this.metadata.versionColumn) {
        const versionColumnName = this.metadata.versionColumn.options.name;

        //
        // aktuelle Version der zu speichernden Entity für Selektion und optimistic lock detection
        //
        const version: number = dbSubject[this.metadata.versionColumn.options.name];
        dbSubject[versionColumnName] = version + 1;

        query = query
          .andWhere(versionColumnName, '=', version);

        if (log.isDebugEnabled()) {
          log.debug(`query prepared for updating version in table ${this.tableName}`);
        }
      }

      return query;
    });
  }

  /**
   * Liefert eine Query, die über die id-Column eine Entity selektiert und die Version inkrementiert,
   * falls dies eine versionierte Entity ist.
   *
   * @private
   * @param {Knex.Transaction} trx
   * @param {*} dbSubject
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  private createSelectorQuery(trx: Knex.Transaction, id: any): Knex.QueryBuilder {
    return using(new XLog(BaseService.logger, levels.INFO, 'createSelectorQuery'), (log) => {
      let query: Knex.QueryBuilder = this.knexService.knex.table(this.tableName)
        .where(this.idColumnName, id);
      return query;
    });
  }





  /**
   * Liefert eine Query, die für die aktuelle Transaktion @param{trx} und Tabelle die
   * Version in der Tabelle 'entityversion' um eins erhöht oder eine nop-query, falls keine Tabelle 'entityversion'
   * definiert ist.
   *
   * @private
   * @param {Knex.Transaction} trx
   * @returns {Knex.QueryBuilder}
   *
   * @memberof BaseService
   */
  private createEntityVersionIncrement(trx: Knex.Transaction): Knex.QueryBuilder {
    return using(new XLog(BaseService.logger, levels.INFO, 'createEntityVersionIncrement'), (log) => {
      let rval = this.knexService.knex.table(this.tableName);

      if (this.entityVersionMetadata) {

        // query zum Inkrement der Version in Tabelle entityversion

        rval = this.knexService.knex.table(this.entityVersionMetadata.tableName)
          .where(this.entityVersionMetadata.primaryKeyColumn.options.name, '=', this.tableName)
          .increment(this.entityVersionMetadata.versionColumn.options.name, 1)
          .transacting(trx);

        if (log.isDebugEnabled()) {
          log.debug(`query prepared for updating version in entityversion for table ${this.tableName}`);
        }

      } else {
        if (log.isDebugEnabled()) {
          log.debug(`no entityversion table`);
        }
      }

      return rval;
    });
  }

}