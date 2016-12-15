// Angular
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Fluxgate
import { Constants, Assert, StringBuilder, User, IUser } from '@fluxgate/common';

import { IRestUri, Service, MetadataService } from '../../services';
import { ConfigService } from '../../services/config.service';


@Injectable()
export class PassportService implements IRestUri {
    public static get LOGIN() { return '/login'; }
    public static get SIGNUP() { return '/signup'; }
    public static get LOGOFF() { return '/logout'; }

    private _url: string;
    private _topic: string = 'passport';

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

        return this.http.post(this.url + PassportService.LOGIN, user)
            .map((response: Response) => {
                <IUser>response.json();
            })
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

        return this.http.post(this.url + PassportService.SIGNUP, user)
            .map((response: Response) => {
                <User>response.json();
            })
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
        return this.http.get(this.url + PassportService.LOGOFF)
            .map((response: Response) => {
            })
            // .do(data => console.log('result: ' + JSON.stringify(data)))
            .catch(Service.handleError);
    }


    /**
     * Liefert die Url inkl. Topic
     * 
     * @readonly
     * @type {string}
     * @memberOf IRestUri
     */
    public get url(): string {
        return this._url;
    }

    /**
     * Liefert das Topic.
     * 
     * @readonly
     * @type {string}
     * @memberOf IRestUri
     */
    public get topic(): string {
        return this._topic;
    }
}