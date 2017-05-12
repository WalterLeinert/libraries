import { Authenticated, Controller, Post, Request } from 'ts-express-decorators';


// Fluxgate
import { IQuery } from '@fluxgate/common';
import { JsonSerializer } from '@fluxgate/core';

import { BaseService } from '../services/baseService';


@Controller('/query')
export class QueryController<T, TId> {
  private serializer: JsonSerializer = new JsonSerializer();

  constructor(private service: BaseService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<T[]> {
    const query = (request as any).body as IQuery;
    const deserializedQuery = this.serializer.deserialize<IQuery>(query);

    return new Promise<T[]>((resolve, reject) => {
      this.service.query(deserializedQuery).then((result) => {
        resolve(this.serializer.serialize<T[]>(result));
      });
    });

  }

}