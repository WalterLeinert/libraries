
// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { ExceptionWrapper, FindResult, ServiceResult } from '@fluxgate/common';
import { Assert, Clone, Funktion, ICtor, IException, JsonSerializer, Types } from '@fluxgate/core';


import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { INanoService } from './nano-service.interface';



/**
 * Abstrakte Basisklasse für REST-Services auf Entities ohne Id
 *
 * @export
 * @abstract
 * @class NanoService
 * @template T
 */
export abstract class NanoService<T> implements INanoService<T>  {
  protected static logger = getLogger(NanoService);
  private serializer: JsonSerializer = new JsonSerializer();

  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */
  public find(request: ISessionRequest): Promise<FindResult<T>> {
    return using(new XLog(NanoService.logger, levels.INFO, 'find', `nano`), (log) => {
      return new Promise<FindResult<T>>((resolve, reject) => {
        resolve(new FindResult([], undefined));
      })
    })
  }

  protected createBusinessException(error: string | IException | Error): IException {
    return ExceptionWrapper.createBusinessException(error);
  }

  protected createSystemException(error: string | IException | Error): IException {
    return ExceptionWrapper.createSystemException(error);
  }



  /**
   * Serialisiert das @param{item} für die Übertragung zum Client über das REST-Api.
   *
   * @param {any} item
   * @returns {any}
   */
  protected serialize<TSerialize>(item: TSerialize): any {
    Assert.notNull(item);
    return this.serializer.serialize(item);
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Client zum Server übertragen wurde
   *
   * @param {any} json - Json-Objekt vom Client
   * @returns {any}
   *
   */
  protected deserialize<TSerialize>(json: any): TSerialize {
    Assert.notNull(json);
    return this.serializer.deserialize<TSerialize>(json);
  }

}
