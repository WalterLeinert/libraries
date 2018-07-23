
import { HttpClient } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';

import * as HttpStatusCodes from 'http-status-codes';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { IServiceCore } from '@fluxgate/common';
import {
  Assert, Constants, IException, JsonSerializer, NotSupportedException, ServerSystemException, StringBuilder
} from '@fluxgate/core';


/**
 * Abstract base class for common rest-api service calls
 */
export abstract class ServiceCore implements IServiceCore {
  protected static logger = getLogger(ServiceCore);

  private static _serializer: JsonSerializer = new JsonSerializer();
  private _url: string;



  /**
   * Creates an instance of ServiceBase.
   *
   * @param _http - Http client
   * @param baseUrl - base url of request
   */
  protected constructor(private _http: HttpClient, baseUrl: string, private _topic: string) {
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
   */
  public getUrl(): string {
    return this._url;
  }

  /**
   * Liefert das Topic.
   */
  public getTopic(): string {
    return this._topic;
  }


  /**
   * Liefert den Topicpfad (z.B. '/artikel' bei Topic 'artikel').
   */
  public getTopicPath(): string {
    return Constants.PATH_SEPARATOR + this.getTopic();
  }


  /**
   * Handles server communication errors.
   *
   * @param error
   * @returns
   *
   * @memberOf ServiceBase
   */
  public static handleServerError(response: Response): Observable<never> {
    return observableThrowError(ServiceCore.createServerException(response));
  }


  /**
   * Erzeugt eine Serverexception für die Response @param{response}
   */
  public static createServerException(response: Response): IException {
    return using(new XLog(ServiceCore.logger, levels.INFO, 'handleServerError'), (log) => {
      // In a real world app, we might use a remote logging infrastructure
      let errorMessage = '** unknown error **';

      Promise.all([response.text(), response.json()])
        .then((res) => {
          const errorMsg = res[0];
          const json = res[1];

          if (response.status < HttpStatusCodes.OK || response.status >= HttpStatusCodes.MULTIPLE_CHOICES) {
            errorMessage = errorMsg;
          }

          if (response.status === 0) {
            errorMessage = 'Server down ?';
          }

          log.error(`errorMessage = ${errorMessage}: [ ${ServiceCore.formatResponseStatus(response)} ]`);

          if (JsonSerializer.isSerialized(json)) {
            return ServiceCore._serializer.deserialize<IException>(json);
          }

          return new ServerSystemException(errorMessage);
        });

      throw new NotSupportedException('has to be changed due to Promise.all');
      // return new ServerSystemException(errorMessage);
    });
  }



  /**
   * Liefert den Http-Clientservice
   */
  protected get http(): HttpClient {
    return this._http;
  }


  protected handleError(response: Response): Observable<never> {
    return ServiceCore.handleServerError(response);
  }


  protected serialize<TSource>(value: TSource): any {
    return ServiceCore._serializer.serialize<TSource>(value);
  }

  protected deserialize<TDest>(json: any): TDest {
    return ServiceCore._serializer.deserialize<TDest>(json);
  }


  private static formatResponseStatus(response: Response): string {
    const sb = new StringBuilder();
    sb.append(`status = ${response.status}`);
    if (response.status > 0) {
      sb.append(` / "${HttpStatusCodes.getStatusText(response.status)}"`);
    }
    sb.append(`; statusText = "${response.statusText || ''}"`);

    return sb.toString();
  }

}
