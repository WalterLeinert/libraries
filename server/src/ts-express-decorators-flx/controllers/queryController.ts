import { Authenticated, Controller, Post, Request } from 'ts-express-decorators';


// Fluxgate
import { IQuery } from '@fluxgate/common';

import { BaseService } from '../services/baseService';


@Controller('/query')
export class QueryController<T, TId> {
  constructor(private service: BaseService<T, TId>) {
  }

  @Authenticated()
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<T[]> {
    const query = (request as any).body as IQuery;
    return this.service.query(query);
  }

}