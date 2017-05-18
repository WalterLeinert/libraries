import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request, Required, Session
} from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  UpdateResult, User
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { UserService } from '../services/user.service';
import { ISession } from '../session/session.interface';
import { ControllerBase } from './base/controllerBase';


@Controller('/user')
export class UserController extends ControllerBase<User, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<CreateResult<User, number>> {
    return super.createInternal(session, (request as any).body as User);
  }


  // @Authenticated()
  @Get('/')
  public find(
    @Required() @Session() session: ISession,
  ): Promise<FindResult<User>> {
    return super.findInternal(session);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Required() @Session() session: ISession,
    @PathParams('id') id: number
    ): Promise<FindByIdResult<User, number>> {
    return super.findByIdInternal(session, id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<QueryResult<User>> {
    return super.queryInternal(session, (request as any).body as IQuery);
  }


  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<UpdateResult<User, number>> {
    return super.updateInternal(session, (request as any).body as User);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @Required() @Session() session: ISession,
    @PathParams('id') id: number
    ): Promise<DeleteResult<number>> {
    return super.deleteInternal(session, id);
  }
}