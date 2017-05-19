import { Authenticated, Controller, Post, Request, Required, Session } from 'ts-express-decorators';


// Fluxgate
import { QueryResult } from '@fluxgate/common';
import { Deprecated, IQuery, JsonSerializer } from '@fluxgate/core';

import { ReadonlyService } from '../../services/readonly-service';
import { IBodyRequest } from '../../session/body-request.interface';


@Deprecated('noch benötigt?')
@Controller('/query')
export class QueryController<T, TId> {
  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: ReadonlyService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: IBodyRequest<IQuery>
    ): Promise<QueryResult<T>> {
    const deserializedQuery = this.serializer.deserialize<IQuery>(request.body);

    return new Promise<QueryResult<T>>((resolve, reject) => {
      this.service.query(request, deserializedQuery).then((result) => {
        resolve(this.serializer.serialize(result));
      });
    });

  }

}