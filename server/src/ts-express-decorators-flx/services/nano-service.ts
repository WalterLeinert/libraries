
// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  ExceptionWrapper, FindResult, IUser,
  ServiceResult, TableMetadata, User
} from '@fluxgate/common';
import {
  Assert, Clone, Funktion, ICtor,
  IException,
  IToString,
  JsonSerializer, Types
} from '@fluxgate/core';


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
 * @template TId
 */
export abstract class NanoService<T> implements INanoService<T>  {
  protected static logger = getLogger(NanoService);
  private serializer: JsonSerializer = new JsonSerializer();





  public find(request: ISessionRequest): Promise<FindResult<T>> {
    return using(new XLog(NanoService.logger, levels.INFO, 'find', `nano`), (log) => {
      return new Promise<FindResult<T>>((resolve, reject) => {
        resolve(new FindResult([], undefined));
      })
    })
  }


  /**
   * Liefert alle Entity-Instanzen vom Typ {T} als @see{Promise}
   *
   * @returns {Promise<T[]>}
   *
   * @memberOf ServiceBase
   */

  /*
  public find(
    request: ISessionRequest
  ): Promise<FindResult<T>> {
    return using(new XLog(NanoService.logger, levels.INFO, 'find', `[${this.tableName}]`), (log) => {

      return new Promise<FindResult<T>>((resolve, reject) => {
        this.knexService.knex.transaction((trx) => {

          const query = this.createClientSelectorQuery(request, trx);

          query

            .then((rows) => {
              if (rows.length <= 0) {
                log.debug('result: no items');
                resolve(new FindResult([], undefined));
              } else {
                const result = this.createModelInstances(rows);

                if (log.isDebugEnabled) {
                  const logResult = this.createModelInstances(Clone.clone(rows));
                  //
                  // falls wir User-Objekte gefunden haben, wird für das Logging
                  // die Passwort-Info zurückgesetzt
                  //
                  if (logResult.length > 0) {
                    if (Types.hasMethod(logResult[0], 'resetCredentials')) {
                      logResult.forEach((item) => (item as any as IUser).resetCredentials());
                    }
                  }
                  log.debug('result = ', logResult);
                }

                // entityVersionMetadata vorhanden und wir suchen nicht entityVersionMetadata
                if (this.hasEntityVersionInfo()) {
                  this.findEntityVersionAndResolve(trx, FindResult, result, resolve);
                } else {
                  trx.commit();
                  resolve(new FindResult(result, -1));
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

*/






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
