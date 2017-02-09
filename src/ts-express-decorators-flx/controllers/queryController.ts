import {
    Authenticated, Controller, Delete, Get, PathParams,
    Post, Put,
    Request
} from 'ts-express-decorators';

// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

// Fluxgate
import { IQuery, IToString } from '@fluxgate/common';

import { BaseService } from '../services/base.service';


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