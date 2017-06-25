import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, MetadataService, Service } from '@fluxgate/client';
import {
  ConfigBase, FindResult, QueryResult, SmtpConfig, StatusFilter,
  StatusQuery, SystemConfig, TableService
} from '@fluxgate/common';
import { Funktion, IToString, NotSupportedException, Query, SelectorTerm } from '@fluxgate/core';


/**
 * Service für REST-Api für Entities mit der Basisklasse @see{ConfigBase}.
 *
 * @export
 * @class ConfigService
 * @extends {Service<ConfigBase, string>}
 */
// @Injectable()
// @TableService(ConfigBase)
export abstract class ConfigService<T extends ConfigBase> extends Service<T, string> {

  protected constructor(metadataService: MetadataService, http: Http, configService: AppConfigService,
    model: Funktion = ConfigBase) {
    super(model, metadataService, http, configService);
  }


  public find(filter?: StatusFilter): Observable<FindResult<ConfigBase>> {
    throw new NotSupportedException();
  }


  /**
   * Hilfsmethode: simuliert die find() Methode über eine Query nach dem Type-Prefix in der Id einer
   *
   * @protected
   * @param {string} type
   * @param {StatusFilter} [filter]
   * @returns {Observable<FindResult<ConfigBase>>}
   * @memberof ConfigService
   */
  protected findByType(type: string, filter?: StatusFilter): Observable<FindResult<ConfigBase>> {
    const query = new StatusQuery(
      new SelectorTerm({
        name: 'id',
        operator: '=',
        value: `${type}-%`
      })
    );
    query.status = filter;

    return Observable.create((observer: Subscriber<FindResult<ConfigBase>>) => {
      super.query(query).subscribe((result) => {
        observer.next(new FindResult(result.items, result.entityVersion));
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
