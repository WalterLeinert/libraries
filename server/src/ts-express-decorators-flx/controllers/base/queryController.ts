import { Authenticated, Controller, Post, Request } from 'ts-express-decorators';


// Fluxgate
import { QueryResult } from '@fluxgate/common';
import { Deprecated, IQuery, JsonSerializer } from '@fluxgate/core';

import { FindService } from '../../services/find-service';

@Deprecated('noch benötigt?')
@Controller('/query')
export class QueryController<T, TId> {
  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: FindService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<QueryResult<T>> {
    const query = (request as any).body as IQuery;
    const deserializedQuery = this.serializer.deserialize<IQuery>(query);

    return new Promise<QueryResult<T>>((resolve, reject) => {
      this.service.query(deserializedQuery).then((result) => {
        resolve(this.serializer.serialize(result));
      });
    });

  }

}