import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';

import * as HttpStatusCodes from 'http-status-codes';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Assert, Constants, StringBuilder } from '@fluxgate/common';


/**
 * Abstract base class for common rest-api service calls
 * 
 * @export
 * @abstract
 * @class Service
 * @template T
 */
export abstract class ServiceBase {
  protected static logger = getLogger(ServiceBase);

  private _url: string;


  /**
   * Creates an instance of ServiceBase.
   * 
   * @param {Http} _http - Http client
   * @param {string} baseUrl - base url of request
   * 
   * @memberOf ServiceBase
   */
  protected constructor(private _http: Http, baseUrl: string, private _topic: string) {
    Assert.notNull(_http);
    Assert.notNullOrEmpty(baseUrl);
    Assert.notNullOrEmpty(_topic);

    const sb = new StringBuilder(baseUrl);

    if (!baseUrl.endsWith(Constants.PATH_SEPARATOR)) {
      sb.append(Constants.PATH_SEPARATOR);
    }

    sb.append(this._topic);
    this._url = sb.toString();
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
   * Liefert den Http-Clientservice
   * 
   * @readonly
   * @protected
   * @type {Http}
   * @memberOf ServiceBase
   */
  protected get http(): Http {
    return this._http;
  }


  /**
   * Handles server communication errors.
   * 
   * @private
   * @param {Response} error
   * @returns
   * 
   * @memberOf ServiceBase
   */
  protected handleError(response: Response): ErrorObservable {
    // In a real world app, we might use a remote logging infrastructure
    let errorMessage = '** unknown error **';

    if (response.status < HttpStatusCodes.OK || response.status >= HttpStatusCodes.MULTIPLE_CHOICES) {
      errorMessage = response.text();
    }

    ServiceBase.logger.error(`${response.status} - ${response.statusText || ''} -- ${errorMessage}`);
    return Observable.throw(new Error(errorMessage));
  }



}