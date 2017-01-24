import {
    Controller, Get, Post, Put, Delete,
    PathParams, Request,
    Authenticated
} from 'ts-express-decorators';

// -------------------------- logging -------------------------------
import { Logger, getLogger } from 'log4js';
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
        let query = <IQuery> (<any>request).body;
        return this.service.query(query);
    }

}