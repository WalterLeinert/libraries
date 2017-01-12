import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as HttpStatusCodes from 'http-status-codes';

import { TableMetadata, IToString } from '@fluxgate/common';
import { Constants, Assert, StringBuilder } from '@fluxgate/common';

import { ConfigService } from './config.service';
import { MetadataService } from './metadata.service';
import { IService } from './service.interface';


/**
 * Abstract base class for common rest-api service calls
 * 
 * @export
 * @abstract
 * @class Service
 * @template T
 */
export abstract class Service<T, TId extends IToString> implements IService {
    private _url: string;
    private _tableMetadata: TableMetadata;


    /**
     * Handles server communication errors.
     * 
     * @private
     * @param {Response} error
     * @returns
     * 
     * @memberOf Service
     */
    public static handleError(response: Response): ErrorObservable<Error> {
        // In a real world app, we might use a remote logging infrastructure
        let errorMessage = '** unknown error **';

        if (response.status < HttpStatusCodes.OK || response.status >= HttpStatusCodes.MULTIPLE_CHOICES) {
            errorMessage = response.text();
        }

        console.error(`${response.status} - ${response.statusText || ''} -- ${errorMessage}`);
        return Observable.throw(new Error(errorMessage));
    }



    /**
     * Creates an instance of Service.
     * 
     * @param {Http} _http - Http client
     * @param {string} baseUrl - base url of request
     * 
     * @memberOf Service
     */
    protected constructor(model: Function, private metadataService: MetadataService,
        private http: Http, configService: ConfigService, private _topic?: string) {
        Assert.notNull(model, 'model');
        Assert.notNull(metadataService, 'metadataService');
        Assert.notNull(http, 'http');
        Assert.notNull(configService, 'configService');

        let baseUrl = configService.config.url;

        // Metadaten zur Entity ermitteln
        this._tableMetadata = this.metadataService.findTableMetadata(model);
        Assert.notNull(this._tableMetadata);

        if (this._topic === undefined) {
            this._topic = this._tableMetadata.options.name;
        }

        let sb = new StringBuilder(configService.config.url);

        if (!baseUrl.endsWith(Constants.PATH_SEPARATOR)) {
            sb.append(Constants.PATH_SEPARATOR);
        }

        sb.append(this._topic);
        this._url = sb.toString();

        this._tableMetadata.registerService(this.constructor);
    }



    /**
     * Create the entity {item} and return {Observable<T>}
     * 
     * @param {T} item
     * @returns {Observable<T>}
     * 
     * @memberOf Service
     */
    public create(item: T): Observable<T> {
        Assert.notNull(item, 'item');

        return this.http.post(this.getUrl(), this.serialize(item))
            .map((response: Response) => this.deserialize(response.json()))
            .do(data => console.log('insertresult: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }



    /**
     * Find all entities of type T and return {Observable<T[]>}.
     * 
     * @returns {Observable<T[]>}
     * 
     * @memberOf Service
     */
    public find(): Observable<T[]> {
        return this.http.get(this.getUrl())
            .map((response: Response) => this.deserializeArray(response.json()))
            // .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Find the entity with the given id and return {Observable<T>}
     * 
     * @param {TId} id -- entity id.
     * @returns {Observable<T>}
     * 
     * @memberOf Service
     */
    public findById(id: TId): Observable<T> {
        Assert.notNull(id, 'id');

        return this.http.get(`${this.getUrl()}/${id}`)
            .map((response: Response) => this.deserialize(response.json()))
            .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Update the entity {item} with the given id and return {Observable<T>}
     * 
     * @param {T} item
     * @returns {Observable<T>}
     * 
     * @memberOf Service
     */
    public update(item: T): Observable<T> {
        Assert.notNull(item, 'item');

        return this.http.put(`${this.getUrl()}`, this.serialize(item))
            .map((response: Response) => this.deserialize(response.json()))
            .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Delete the entity with the given id and return {Observable<T>}
     * 
     * @param {TId} id
     * @returns {Observable<T>}
     * 
     * @memberOf Service
     */
    public delete(id: TId): Observable<T> {
        Assert.notNull(id, 'id');

        return this.http.delete(`${this.getUrl()}/${id}`)
            .map((response: Response) => <T>response.json())
            .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }

    /**
     * Serialisiert das @param{item} für die Übertragung zum Server über das REST-Api.
     * 
     * TODO: ggf. die Serialisierung von speziellen Attributtypen (wie Date) implementieren
     * 
     * @param {T} item - Entity-Instanz
     * @returns {any}
     */
    private serialize(item: T): any {
        Assert.notNull(item);
        return item;
    }


    /**
     * Deserialisiert das Json-Objekt, welches über das REST-Api vom Server zum Client übertragen wurde
     * 
     * @param {any} json - Json-Objekt vom Server
     * @returns {T}
     * 
     * @memberOf Service
     */
    private deserialize(json: any): T {
        Assert.notNull(json);
        // Die Properties im Json-Objekt haben dieselben Namen wie die Modellinstanz -> mapColumns = false
        return this.tableMetadata.createModelInstance<T>(json, false);
    }

    /**
     * Deserialisiert ein Array von Json-Objekten, welches über das REST-Api vom Server zum Client übertragen wurde
     * 
     * @param {any} json - Array von Json-Objekten vom Server
     * @returns {T[]}
     */
    private deserializeArray(jsonArray: any): T[] {
        Assert.notNull(jsonArray);

        if (!Array.isArray(jsonArray)) {
            throw new Error('json: ist kein Array');
        }

        let result = new Array<T>();
        jsonArray.forEach(item => {
            result.push(this.deserialize(item));
        });

        return result;
    }


    /**
     * Liefert die zugehörige @see{TableMetadata} 
     * 
     * @readonly
     * @protected
     * @type {TableMetadata}
     * @memberOf Service
     */
    protected get tableMetadata(): TableMetadata {
        return this._tableMetadata;
    }

    /**
     * Liefert die Url inkl. Topic
     * 
     * @type {string}
     */
    public getUrl(): string {
        return this._url;
    }

    /**
     * Liefert das Topic.
     * 
     * @type {string}
     */
    public getTopic(): string {
        return this._topic;
    }


    /**
     * Liefert den Topicpfad (z.B. '/artikel' bei Topic 'artikel').
     * 
     * @type {string}
     */
    public getTopicPath(): string {
        return Constants.PATH_SEPARATOR + this.getTopic();
    }

    /**
     * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
     * 
     * @type {string}
     */
    public getModelClassName(): string {
        return this._tableMetadata.className;
    }

    /**
     * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
     * Sonst wird ein Error geworfen.
     * 
     * @type {any}
     * @memberOf Service
     */
    public getEntityId(item: T): TId {
        if (!this._tableMetadata.primaryKeyColumn) {
            throw new Error(`Table ${this._tableMetadata.options.name}: no primary key column`);
        }
        return item[this._tableMetadata.primaryKeyColumn.propertyName];
    }

}