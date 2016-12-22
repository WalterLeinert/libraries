import * as Knex from 'knex';

// -------------------------- logging -------------------------------
import { levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { TableMetadata, ColumnMetadata, IToString } from '@fluxgate/common';

import { MetadataService } from './metadata.service';
import { KnexService } from './knex.service';

/**
 * Abstrakte Basisklasse für CRUD-Operationen auf der DB über knex.
 * 
 * @export
 * @abstract
 * @class ServiceBase
 * @template T
 * @template TId
 */
export abstract class BaseService<T, TId extends IToString>  {
    static logger = getLogger('BaseService');

    private primaryKeyColumn: ColumnMetadata = null;
    private metadata: TableMetadata;

    /**
     * Creates an instance of ServiceBase.
     * 
     * @param {{ new (): T }} ctor
     * @param {string} _tableName
     * @param {string} _idName
     * 
     * @memberOf ServiceBase
     */
    constructor(table: Function, private knexService: KnexService, private metadataService: MetadataService) {
        this.metadata = this.metadataService.findTableMetadata(table);

        let cols = this.metadata.columnMetadata.filter((item: ColumnMetadata) => item.options.primary);
        if (cols.length <= 0) {
            BaseService.logger.warn(`Table ${this.metadata.options.name}: no primary key column`);
        }
        this.primaryKeyColumn = cols[0];
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
    ): Promise<T> {

        return using(new XLog(BaseService.logger, levels.INFO, 'create', `[${this.tableName}]`), (log) => {
            if (log.isDebugEnabled) {
                log.debug('subject: ', subject);
            }
            

            let dbSubject = this.createDatabaseInstance(subject);

            if (log.isDebugEnabled()) {
                log.debug('dbSubject: ', dbSubject);
            }

            return new Promise<T>((resolve, reject) => {
                this.fromTable()
                    .insert(dbSubject)
                    .then((ids: number[]) => {

                        if (ids.length <= 0) {
                            log.error(`ids empty`);
                            // console.log('create failed: ids empty');
                            reject(new Error('create failed: ids empty'));
                        } else if (ids.length > 1) {
                            reject(new Error('create failed: ids.length > 1'));
                        } else {
                            let id = ids[0];
                            log.debug(`created new ${this.tableName} with id: ${id}`);
                            // console.log(`created new ${this.tableName} with id: ${id}`);
                            
                            // TODO: id == 0?
                            // dbSubject[this.idColumnName] = id;

                            subject = this.createModelInstance(dbSubject);
                            resolve(subject);
                        }
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });

            });
        });
    }


    /**
     * Liefert eine Entity-Instanz vom Typ {T} aus der DB als @see{Promise}
     * 
     * @param {TId} id
     * @returns {Promise<T>}
     * 
     * @memberOf ServiceBase
     */
    public findById(
        id: TId
    ): Promise<T> {

        return using(new XLog(BaseService.logger, levels.INFO, 'findById', `[${this.tableName}] id = ${id}`), (log) => {

            return new Promise<T>((resolve, reject) => {
                this.fromTable()
                    .where(this.idColumnName, id.toString())
                    .then((rows: any[]) => {
                        if (rows.length <= 0) {
                            log.debug('result: no item found');
                            resolve(null);
                        } else {
                            let result = this.createModelInstance(rows[0]);

                            // let result = Reflection.copyProperties(rows[0], this.ctor);

                            log.debug('result = ', result);
                            resolve(result);
                        }
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });
            });
        });
    }


    /**
     * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
     * 
     * @returns {Promise<T[]>}
     * 
     * @memberOf ServiceBase
     */
    public find(
    ): Promise<T[]> {
        return using(new XLog(BaseService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

            return new Promise<T[]>((resolve, reject) => {
                this.fromTable()
                    .then(rows => {
                        if (rows.length <= 0) {
                            log.debug('result: no items');
                            resolve(new Array<T>());
                        } else {
                            let result = this.createModelInstances(rows);

                            log.debug('result = ', result);
                            resolve(result);
                        }
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });
            });
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
    ): Promise<T> {

        return using(new XLog(BaseService.logger, levels.INFO, 'update', `[${this.tableName}]`), (log) => {
            log.debug('subject: ', subject);

            let dbSubject = this.createDatabaseInstance(subject);
            return new Promise<T>((resolve, reject) => {
                this.fromTable()
                    .where(this.idColumnName, dbSubject[this.idColumnName])
                    .update(dbSubject)
                    .then((affectedRows: number) => {
                        log.debug(`updated ${this.tableName} with id: ${dbSubject[this.idColumnName]} (affectedRows: ${affectedRows})`, );
                        resolve(subject);
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });
            });
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
    ): Promise<TId> {

        return using(new XLog(BaseService.logger, levels.INFO, 'delete', `[${this.tableName}] id = ${id}`), (log) => {
            return new Promise<TId>((resolve, reject) => {
                this.fromTable()
                    .where(this.idColumnName, id.toString())
                    .del()
                    .then((affectedRows: number) => {
                        log.debug(`deleted from ${this.tableName} with id: ${id} (affectedRows: ${affectedRows})`);
                        resolve(id);
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });
            });
        });

    }

    /**
     * Führt die Query {query} aus und liefert ein Array von Entity-Instanzen vom Typ {T} als @see{Promise}
     * 
     * @param {Knex.QueryBuilder} query
     * @returns {Promise<T[]>}
     * 
     * @memberOf ServiceBase
     */
    public query(
        query: Knex.QueryBuilder
    ): Promise<T[]> {

        return using(new XLog(BaseService.logger, levels.INFO, 'query', `[${this.tableName}]`), (log) => {

            return new Promise<T[]>((resolve, reject) => {
                query
                    .then(rows => {
                        if (rows.length <= 0) {
                            log.debug('result: no item found');
                            resolve(null);
                        } else {
                            let result = this.createModelInstances(rows);

                            log.debug('result = ', result);
                            resolve(result);
                        }
                    })
                    .catch(err => {
                        log.error(err);
                        reject(err);
                    });
            });
        });
    }


    protected createDatabaseInstance(entity: T): any {
        return this.metadata.createDatabaseInstance<T>(entity);
    }

    /**
     * Erzeugt aus der DB-Row @param{row} (JSON) eine Modellinstanz vom Typ @see{T}
     * 
     * @protected
     * @param {*} row
     * @returns {T}
     * 
     * @memberOf BaseService
     */
    protected createModelInstance(row: any): T {
        return this.metadata.createModelInstance<T>(row);
    }

    /**
     * Erzeugt aus dem Array von DB-Rows @param{rows} (JSON) ein Array von Modellinstanzen vom Typ @see{T}
     * 
     * @protected
     * @param {any[]} rows
     * @returns {T[]}
     * 
     * @memberOf BaseService
     */
    protected createModelInstances(rows: any[]): T[] {
        let result = new Array<T>();
        for (let row of rows) {
            result.push(this.metadata.createModelInstance<T>(row));
        }
        return result;
    }

    /**
     * Liefert die from(<table>) Clause für den aktuellen Tabellennamen
     * 
     * @readonly
     * @protected
     * @type {Knex.QueryBuilder}
     * @memberOf ServiceBase
     */
    public fromTable(): Knex.QueryBuilder {
        return this.knexService.knex(this.tableName);
    }

    /**
     * Liefert den DB-Tabellennamen
     * 
     * @readonly
     * @type {string}
     * @memberOf ServiceBase
     */
    protected get tableName(): string {
        return this.metadata.options.name;
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
            throw new Error(`Table ${this.tableName}: no primary key column`);
        }
        return this.primaryKeyColumn.options.name;
    }
}