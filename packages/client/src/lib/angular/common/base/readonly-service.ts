import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import { FindByIdResult, IEntity } from '@fluxgate/common';
import { Assert, Core, Funktion, IToString } from '@fluxgate/core';

import { AppConfigService } from '../../services/app-config.service';
import { MetadataService } from '../../services/metadata.service';
import { CoreService } from './core-service';


/**
 * Abstrakte Basisklasse für alle REST-Services, die noch auf Entities arbeiten,
 * die einen Primary Key haben (Interface @see{IEntity})
 */
export abstract class ReadonlyService<T extends IEntity<TId>, TId extends IToString> extends CoreService<T, TId> {
  protected static logger = getLogger(ReadonlyService);


  protected constructor(model: Funktion, metadataService: MetadataService,
    http: HttpClient, configService: AppConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }


  /**
   * Find the entity with the given id.
   *
   * @param id -- entity id.
   * @returns
   *
   * @memberOf Service
   */
  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    Assert.notNull(id, 'id');
    return using(new XLog(ReadonlyService.logger, levels.INFO, 'findById',
      `[${this.getModelClassName()}]; id = ${id}`), (log) => {

        return this.http.get(`${this.getUrl()}/${id}`)
          .pipe(
            map((response: Response) => this.deserialize(response.json())),
            tap((result: FindByIdResult<T, TId>) => {
              if (log.isInfoEnabled()) {
                log.log(`found [${this.getModelClassName()}]: id = ${id} -> ${Core.stringify(result)}`);
              }
            }),
            catchError<FindByIdResult<T, TId>, any>(this.handleError)
          );
      });
  }
}