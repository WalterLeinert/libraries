// Angular
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Fluxgate
import { Constants, Assert, StringBuilder, User, IUser } from '@fluxgate/common';

import { Serializer } from '../../../base/serializer';
import { IRestUri, IServiceBase, Service, MetadataService } from '../../services';
import { ConfigService } from '../../services/config.service';


@Injectable()
export class PassportService implements IServiceBase {
    public static get LOGIN() { return '/login'; }
    public static get SIGNUP() { return '/signup'; }
    public static get LOGOFF() { return '/logout'; }

    private _url: string;
    private _topic: string = 'passport';
    private serializer: Serializer<IUser>;

    /**
     * Creates an instance of PassportService.
     * 
     * @param {Http} http
     * @param {ConfigService} configService
     * @param {string} _topic - das Topic des Service
     * 
     * @memberOf PassportService
     */
    constructor(private http: Http, configService: ConfigService, private metadataService: MetadataService) {
        Assert.notNull(http, 'http');
        Assert.notNull(configService, 'configService');
        Assert.notNull(configService.config, 'configService.config');
        Assert.notNullOrEmpty(configService.config.url, 'configService.config.url');

        let sb = new StringBuilder(configService.config.url);

        if (!configService.config.url.endsWith(Constants.PATH_SEPARATOR)) {
            sb.append(Constants.PATH_SEPARATOR);
        }

        sb.append(this._topic);
        this._url = sb.toString();

        // Metadaten zur Entity ermitteln
        let tableMetadata = this.metadataService.findTableMetadata(User);
        Assert.notNull(tableMetadata);

        this.serializer = new Serializer<User>(tableMetadata);
    }


    /**
     * Meldet den Benutzer mit Benutzernamen {username} beim System an.
     * 
     * @param {string} username
     * @param {string} password
     * 
     * @memberOf PassportService
     */
    public login(username: string, password: string): Observable<IUser> {
        Assert.notNullOrEmpty(username, 'username');
        Assert.notNullOrEmpty(password, 'password');

        let userTableMetadata = this.metadataService.findTableMetadata(User.name);
        Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name} nicht gefunden.`);

        let user = userTableMetadata.createEntity<IUser>();
        user.username = username;
        user.password = password;

        return this.http.post(this.getUrl() + PassportService.LOGIN, user)
            .map((response: Response) => this.deserialize(response.json()))
            // .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Registriert einen neuen Benutzer im System
     * 
     * @param {User} user
     * @returns {Observable<User>}
     * 
     * @memberOf PassportService
     */
    public signup(user: User): Observable<User> {
        Assert.notNull(user, 'user');

        return this.http.post(this.getUrl() + PassportService.SIGNUP, user)
            .map((response: Response) => this.deserialize(response.json()))
            // .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Meldet den aktuellen Benutzer ab
     * 
     * @returns {Observable<any>}
     * 
     * @memberOf PassportService
     */
    public logoff() {
        return this.http.get(this.getUrl() + PassportService.LOGOFF)
            .map((response: Response) => {
            })
            // .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
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

    public getTopicPath(): string {
        return Constants.PATH_SEPARATOR + this.getTopic();
    }

       /**
     * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
     * 
     * @type {string}
     */
    public getModelClassName(): string {
        throw new Error(`Not supported`);
    }

    /**
     * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
     * Sonst wird ein Error geworfen.
     * 
     * @type {any}
     * @memberOf Service
     */
    public getEntityId(item: any): any {
        throw new Error(`Not supported`);
    }


    /**
     * Serialisiert das @param{item} für die Übertragung zum Server über das REST-Api.
     * 
     * TODO: ggf. die Serialisierung von speziellen Attributtypen (wie Date) implementieren
     * 
     * @param {T} item - Entity-Instanz
     * @returns {any}
     */
    private serialize(item: IUser): any {
        return this.serializer.serialize(item);
    }

    /**
     * Deserialisiert das Json-Objekt, welches über das REST-Api vom Server zum Client übertragen wurde
     * 
     * @param {any} json - Json-Objekt vom Server
     * @returns {T}
     * 
     * @memberOf Service
     */
    private deserialize(json: any): IUser {
        return this.serializer.deserialize(json);
    }
}