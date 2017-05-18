// Angular
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  ConfigService, CoreComponent, MessageService, MetadataService, Serializer, ServiceBase
} from '@fluxgate/client';
import { IServiceBase, IUser, PasswordChange, User } from '@fluxgate/common';
import { Assert, Constants, NotSupportedException, StringBuilder } from '@fluxgate/core';


@Injectable()
export class PassportService extends CoreComponent implements IServiceBase<any, any> {
  protected static logger = getLogger(PassportService);

  public static get LOGIN() { return '/login'; }
  public static get SIGNUP() { return '/signup'; }
  public static get LOGOFF() { return '/logout'; }
  public static get CHANGE_PASSWORD() { return '/changePassword'; }
  public static get CURRENT_USER() { return '/currentUser'; }

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
  constructor(private http: Http, configService: ConfigService, private metadataService: MetadataService,
    messageService: MessageService) {
    super(messageService);
    using(new XLog(PassportService.logger, levels.INFO, 'ctor'), (log) => {

      Assert.notNull(http, 'http');
      Assert.notNull(configService, 'configService');
      Assert.notNull(configService.config, 'configService.config');
      Assert.notNullOrEmpty(configService.config.url, 'configService.config.url');

      const sb = new StringBuilder(configService.config.url);

      if (!configService.config.url.endsWith(Constants.PATH_SEPARATOR)) {
        sb.append(Constants.PATH_SEPARATOR);
      }

      sb.append(this._topic);
      this._url = sb.toString();

      // Metadaten zur Entity ermitteln
      const tableMetadata = this.metadataService.findTableMetadata(User);
      Assert.notNull(tableMetadata);

      this.serializer = new Serializer<User>(tableMetadata);
    });
  }


  /**
   * Meldet den Benutzer mit Benutzernamen {username} beim System an.
   *
   * @param {string} username
   * @param {string} password
   *
   * @memberOf PassportService
   */
  public login(username: string, password: string, clientId?: number): Observable<IUser> {
    Assert.notNullOrEmpty(username, 'username');
    Assert.notNullOrEmpty(password, 'password');
    return using(new XLog(PassportService.logger, levels.INFO, 'login', `username =  ${username}`), (log) => {

      const userTableMetadata = this.metadataService.findTableMetadata(User.name);
      Assert.notNull(userTableMetadata, `Metadaten für Tabelle ${User.name} nicht gefunden.`);

      clientId = 1;     // TODO

      const user = userTableMetadata.createEntity<IUser>();
      user.username = username;
      user.password = password;
      (user as any).client = clientId;    // TODO

      return this.http.post(this.getUrl() + PassportService.LOGIN, user)
        .map((response: Response) => this.deserialize(response.json()))
        .do((u) => {
          log.log('user: ' + JSON.stringify(u));
        })
        .catch(this.handleServerError);
    });
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
    return using(new XLog(PassportService.logger, levels.INFO, 'signup',
      `username =  ${JSON.stringify(user)}`), (log) => {
        return this.http.post(this.getUrl() + PassportService.SIGNUP, user)
          .map((response: Response) => this.deserialize(response.json()))
          .do((u) => {
            log.log(`user = ${JSON.stringify(u)}`);
          })
          .catch(this.handleServerError);
      });
  }


  /**
   * Meldet den aktuellen Benutzer ab
   *
   * @returns {Observable<any>}
   *
   * @memberOf PassportService
   */
  public logoff() {
    return using(new XLog(PassportService.logger, levels.INFO, 'logoff'), (log) => {
      return this.http.get(this.getUrl() + PassportService.LOGOFF)
        .map((response: Response) => {
          // ok
        }).do((user) => {
          log.log(`user = ${JSON.stringify(user)}`);
        })
        .do((data) => PassportService.logger.info('result: ' + JSON.stringify(data)))
        .catch(this.handleServerError);
    });
  }


  /**
   * Ändert das Passwort des aktuellen Benutzers.
   *
   * @param {string} username - aktueller Username
   * @param {string} password - aktuelles Passwort
   * @param {string} passwordNew - neues Passwort
   *
   * @memberOf PassportService
   */
  public changePassword(username: string, password: string, passwordNew: string): Observable<IUser> {
    Assert.notNullOrEmpty(password, 'password');
    Assert.notNullOrEmpty(passwordNew, 'passwordNew');
    return using(new XLog(PassportService.logger, levels.INFO, 'changePassword', `username = ${username}`), (log) => {
      const passwordChange = new PasswordChange(username, password, passwordNew);

      return this.http.post(this.getUrl() + PassportService.CHANGE_PASSWORD, passwordChange)
        .map((response: Response) => this.deserialize(response.json()))
        .do((user) => {
          log.log(`user = ${JSON.stringify(user)}`);
        })
        .catch(this.handleServerError);
    });
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
    throw new NotSupportedException();
  }

  public getTableName(): string {
    throw new NotSupportedException();
  }


  public getEntityId(item: any): any {
    throw new NotSupportedException();
  }

  public setEntityId(item: any, id: any) {
    throw new NotSupportedException();
  }

  /**
   * Handles server communication errors.
   *
   * @private
   * @param {Response} error
   * @returns
   */
  private handleServerError(response: Response): ErrorObservable {
    return ServiceBase.handleServerError(response);
  }


  /**
   * Serialisiert das @param{item} für die Übertragung zum Server über das REST-Api.
   *
   * TODO: ggf. die Serialisierung von speziellen Attributtypen (wie Date) implementieren
   *
   * @param {T} item - Entity-Instanz
   * @returns {any}
   */
  // tslint:disable-next-line:no-unused-variable
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