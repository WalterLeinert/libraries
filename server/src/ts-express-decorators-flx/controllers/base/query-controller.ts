import { Authenticated, Controller, Post, Request } from 'ts-express-decorators';


// Fluxgate
import { QueryResult } from '@fluxgate/common';
import { Deprecated, IQuery } from '@fluxgate/core';

import { ICoreService } from '../../services/core-service.interface';
import { IBodyRequest } from '../../session/body-request.interface';
import { ControllerCore } from './controller-core';


@Deprecated('noch benötigt?')
@Controller('/query')
export class QueryController<T, TId> extends ControllerCore {

  constructor(service: ICoreService<T>) {
    super(service);
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: IBodyRequest<IQuery>
    ): Promise<QueryResult<T>> {
    const deserializedQuery = this.deserialize<IQuery>(request.body);

    return new Promise<QueryResult<T>>((resolve, reject) => {
      this.getService().query(request, deserializedQuery).then((result) => {
        resolve(this.serialize(result));
      });
    });

  }


  protected getService(): ICoreService<T> {
    return super.getService() as ICoreService<T>;
  }
}