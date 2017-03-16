import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';

import * as HttpStatusCodes from 'http-status-codes';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { Assert, Constants, ServerSystemException, StringBuilder } from '@fluxgate/common';


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
   * Handles server communication errors.
   * 
   * @private
   * @param {Response} error
   * @returns
   * 
   * @memberOf ServiceBase
   */
  public static handleServerError(response: Response): ErrorObservable {
    return using(new XLog(ServiceBase.logger, levels.INFO, 'handleServerError'), (log) => {
      // In a real world app, we might use a remote logging infrastructure
      let errorMessage = '** unknown error **';

      if (response.status < HttpStatusCodes.OK || response.status >= HttpStatusCodes.MULTIPLE_CHOICES) {
        errorMessage = response.text();
      }

      if (response.status === 0) {
        errorMessage = 'Server down?';
      }

      log.error(`errorMessage = ${errorMessage}: [ ${ServiceBase.formatResponseStatus(response)} ]`);

      return Observable.throw(new ServerSystemException(errorMessage));
    });
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


  protected handleError(response: Response): ErrorObservable {
    return ServiceBase.handleServerError(response);
  }

  private static formatResponseStatus(response: Response): string {
    const sb = new StringBuilder();
    sb.append(`status = ${status}`);
    if (response.status > 0) {
      sb.append(` / "${HttpStatusCodes.getStatusText(response.status)}"`);
    }
    sb.append(`; statusText = ${response.statusText || ''}`);

    return sb.toString();
  }

}