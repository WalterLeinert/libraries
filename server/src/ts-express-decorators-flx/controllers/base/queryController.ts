import { Authenticated, Controller, Post, Request } from 'ts-express-decorators';


// Fluxgate
import { Deprecated, IQuery, JsonSerializer } from '@fluxgate/core';
import { QueryServiceResult } from '@fluxgate/common';

import { BaseService } from '../../services/baseService';

@Deprecated('noch benötigt?')
@Controller('/query')
export class QueryController<T, TId> {
  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: BaseService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: Express.Request
  ): Promise<QueryServiceResult<T>> {
    const query = (request as any).body as IQuery;
    const deserializedQuery = this.serializer.deserialize<IQuery>(query);

    return new Promise<QueryServiceResult<T>>((resolve, reject) => {
      this.service.query(deserializedQuery).then((result) => {
        resolve(this.serializer.serialize(result));
      });
    });

  }

}