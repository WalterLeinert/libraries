import * as Knex from 'knex';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  AppConfig, CreateResult, DeleteResult, IEntity, ProxyModes, ServiceResult, UpdateResult
} from '@fluxgate/common';
import {
  EntityNotFoundException, Funktion, ICtor, IToString, OptimisticLockException
} from '@fluxgate/core';


import { ISessionRequest } from '../session/session-request.interface';
import { IBaseService } from './baseService.interface';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';
import { ReadonlyService } from './readonly-service';


/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 *
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class BaseService<T extends IEntity<TId>, TId extends IToString> extends ReadonlyService<T, TId>
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
    request: ISessionRequest,
    subject: T
  ): Promise<CreateResult<T, TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
      if (log.isDebugEnabled) {
        log.debug('subject: ', subject);
      }

      if (this.metadata.clientColumn) {
        if (request && request.user) {
          subject[this.metadata.clientColumn.name] = request.user.__client;
        }
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

          const query: Knex.QueryBuilder = this.fromTable();

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

                // query für Inkrement der EntityVersion Tabelle erzeugen
                const entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);

                if (entityversionQuery) {
                  // falls supported -> update in entityversion Tabelle
                  entityversionQuery
                    .then((item) => {
                      this.handleResult(trx, CreateResult, subject, 'subject after commit', resolve, reject);
                    });
                } else {
                  this.handleResult(trx, CreateResult, subject, 'subject after commit', resolve, reject);
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
   * Aktualisiert die Entity-Instanz {subject} vom Typ {T} in der DB und liefert die Instanz als @see{Promise}
   *
   * @param {T} subject
   * @returns {Promise<T>}
   *
   * @memberOf ServiceBase
   */
  public update(
    request: ISessionRequest,
    subject: T
  ): Promise<UpdateResult<T, TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
      log.debug('subject: ', subject);

      const dbSubject = this.createDatabaseInstance(subject);

      return new Promise<UpdateResult<T, TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          // quer< zur Selektion der Entity und ggf. des Versionsinkrements
          const query: Knex.QueryBuilder = this.createUpdateQuery(request, trx, subject.id, dbSubject);


          query
            .update(dbSubject)
            .transacting(trx)

            .then((affectedRows: number) => {
              log.debug(`updated ${this.tableName} with id: ${dbSubject[this.idColumnName]}` +
                ` (affectedRows: ${affectedRows})`, );

              //
              // Version-Column vorhanden? -> ggf. optimistic lock exception erzeugen
              //
              if (this.metadata.versionColumn) {
                if (affectedRows <= 0) {
                  trx.rollback();

                  const exc = new OptimisticLockException(`Data was not up to date.\nReload data and try again.`);

                  log.error(exc);
                  reject(exc);
                } else {

                  const resultSubject = this.createModelInstance(dbSubject);


                  log.debug('dbSbject: ', dbSubject);

                  // query für Inkrement der EntityVersion Tabelle erzeugen
                  const entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);

                  if (entityversionQuery) {
                    // falls supported -> update in entityversion Tabelle
                    entityversionQuery
                      .then((item) => {
                        this.handleResult(trx, UpdateResult, resultSubject,
                          'subject after commit (optimistic lock detection)', resolve, reject);
                      });
                  } else {
                    this.handleResult(trx, UpdateResult, resultSubject, 'subject after commit', resolve, reject);
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
                  const resultSubject = this.createModelInstance(dbSubject);

                  // query für Inkrement der EntityVersion Tabelle erzeugen
                  const entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);

                  if (entityversionQuery) {
                    // falls supported -> update in entityversion Tabelle
                    entityversionQuery
                      .then((item) => {
                        this.handleResult(trx, UpdateResult, resultSubject,
                          'subject after commit', resolve, reject);
                      });
                  } else {
                    this.handleResult(trx, UpdateResult, resultSubject, 'subject after commit', resolve, reject);
                  }
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
   * Löscht eine Entity-Instanz vom Typ {T} in der DB und liefert die {Id} als @see{Promise}
   *
   * @param {TId} id
   * @returns {Promise<TId>}
   *
   * @memberOf ServiceBase
   */
  public delete(
    request: ISessionRequest,
    id: TId
  ): Promise<DeleteResult<TId>> {

    return using(new XLog(BaseService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
      return new Promise<DeleteResult<TId>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          let query = this.fromTable();
          query = this.addIdSelector(query, trx, id);

          if (request && request.user) {
            query = this.addClientSelector(query, trx, request.user.__client);
          }

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

                // query für Inkrement der EntityVersion Tabelle erzeugen
                const entityversionQuery: Knex.QueryBuilder = this.createEntityVersionIncrement(trx);

                if (entityversionQuery) {
                  // falls supported -> update in entityversion Tabelle
                  entityversionQuery
                    .then((item) => {
                      this.handleResult(trx, DeleteResult, id, 'delete id after commit', resolve, reject);
                    });
                } else {
                  this.handleResult(trx, DeleteResult, id, 'delete id after commit', resolve, reject);
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
  private createUpdateQuery(request: ISessionRequest, trx: Knex.Transaction, id: TId, dbSubject: any):
    Knex.QueryBuilder {
    return using(new XLog(BaseService.logger, levels.INFO, 'createUpdateQuery'), (log) => {

      let query = this.fromTable();
      query = this.addIdSelector(query, trx, id);

      if (request && request.user) {
        query = this.addClientSelector(query, trx, request.user.__client);
      }


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

        query = this.addVersionSelector(query, trx, version);

        if (log.isDebugEnabled()) {
          log.debug(`query prepared for updating version in table ${this.tableName}`);
        }
      }

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
      let rval;

      //
      // falls wird mit dem EntityVersionProxy arbeiten und im Schema EntityVersion-Metadaten vorliegen
      // inkrementieren wir die Version aktuellen Entity.
      //
      if (this.entityVersionMetadata &&
        (
          (!AppConfig.config) ||
          (
            AppConfig.config && AppConfig.config.proxyMode === ProxyModes.ENTITY_VERSION
          )
        )) {
        // query zum Inkrement der Version in Tabelle entityversion

        rval = this.fromTable(this.entityVersionMetadata.tableName)
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




  private handleResult<TResult>(trx: Knex.Transaction, resultClazz: ICtor<ServiceResult>,
    subject: TResult, logMessage: string, resolve: ((result: ServiceResult | PromiseLike<ServiceResult>) => void),
    reject: ((reason?: any) => void)) {
    using(new XLog(BaseService.logger, levels.INFO, 'handleResult'), (log) => {
      if (this.hasEntityVersionInfo()) {
        this.findEntityVersionAndResolve(trx, resultClazz, subject, resolve, reject);
      } else {
        trx.commit();

        if (log.isDebugEnabled()) {
          log.debug(`${logMessage}: `, subject);
        }

        resolve(new resultClazz(subject, -1));
      }
    });
  }

}