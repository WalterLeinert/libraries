import { Authenticated, Controller, Post, Request, Required, Session } from 'ts-express-decorators';


// Fluxgate
import { QueryResult } from '@fluxgate/common';
import { Deprecated, IQuery, JsonSerializer } from '@fluxgate/core';

import { ReadonlyService } from '../../services/readonly-service';
import { ISession } from '../../session/session.interface';


@Deprecated('noch benötigt?')
@Controller('/query')
export class QueryController<T, TId> {
  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: ReadonlyService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<QueryResult<T>> {
    const query = (request as any).body as IQuery;
    const deserializedQuery = this.serializer.deserialize<IQuery>(query);

    return new Promise<QueryResult<T>>((resolve, reject) => {
      this.service.query(session, deserializedQuery).then((result) => {
        resolve(this.serializer.serialize(result));
      });
    });

  }

}