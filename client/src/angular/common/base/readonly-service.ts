import { Http, Response } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { FindByIdResult, IEntity } from '@fluxgate/common';
import { Assert, Funktion, IToString } from '@fluxgate/core';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { CoreService } from './core-service';


/**
 * Abstrakte Basisklasse für alle REST-Services, die noch auf Entities arbeiten,
 * die einen Primary Key haben (Interface @see{IEntity})
 *
 * @export
 * @abstract
 * @class ReadonlyService
 * @template T
 */
export abstract class ReadonlyService<T extends IEntity<TId>, TId extends IToString> extends CoreService<T, TId> {
  protected static logger = getLogger(ReadonlyService);


  protected constructor(model: Funktion, metadataService: MetadataService,
    http: Http, configService: ConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }


  /**
   * Find the entity with the given id.
   *
   * @param {TId} id -- entity id.
   * @returns {Observable<FindByIdResult<T, TId>>}
   *
   * @memberOf Service
   */
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'findById',
      `[${this.getModelClassName()}]; id = ${id}`), (log) => {

        return this.http.get(`${this.getUrl()}/${id}`)
          .map((response: Response) => this.deserialize(response.json()))
          .do((result: FindByIdResult<T, TId>) => {
            if (log.isInfoEnabled()) {
              log.log(`found [${this.getModelClassName()}]: id = ${id} -> ${JSON.stringify(result)}`);
            }
          })
          .catch(this.handleError);
      });
  }
}