import { Http } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import {
  CreateResult, DeleteResult, FindByIdResult, FindResult,
  QueryResult, UpdateResult
} from '@fluxgate/common';
import { Assert, Funktion, IQuery, IToString, NotSupportedException } from '@fluxgate/core';

import { ConfigService } from '../../services/config.service';
import { MetadataService } from '../../services/metadata.service';
import { Service } from './service';


/**
 * Abstract base class for common readonly rest-api service calls
 *
 * @export
 * @abstract
 * @class ReadonlyService
 * @template T
 */
export abstract class ReadonlyService<T, TId extends IToString> extends Service<T, TId> {
  protected static logger = getLogger(ReadonlyService);


  protected constructor(model: Funktion, metadataService: MetadataService,
    http: Http, configService: ConfigService, topic?: string) {
    super(model, metadataService, http, configService, topic);
  }

  public find(): Observable<FindResult<T>> {
    return super.find();
  }


  public findById(id: TId): Observable<FindByIdResult<T, TId>> {
    return super.findById(id);
  }


  public query(query: IQuery): Observable<QueryResult<T>> {
    return super.query(query);
  }


  public create(item: T): Observable<CreateResult<T>> {
    Assert.notNull(item, 'item');
    return Observable.throw(new NotSupportedException('readonly: create not supported'));
  }


  public update(item: T): Observable<UpdateResult<T>> {
    return Observable.throw(new NotSupportedException('readonly: update not supported'));
  }


  public delete(id: TId): Observable<DeleteResult<TId>> {
    return Observable.throw(new NotSupportedException('readonly: delete not supported'));
  }

}