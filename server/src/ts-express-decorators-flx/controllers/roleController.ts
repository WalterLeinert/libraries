import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request, Required, Session
} from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  Role, UpdateResult
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { RoleService } from '../services/role.service';
import { ISession } from '../session/session.interface';
import { ControllerBase } from './base/controllerBase';


@Controller('/role')
export class RoleController extends ControllerBase<Role, number> {
  constructor(service: RoleService) {
    super(service, 'role', 'role_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<CreateResult<Role, number>> {
    return super.createInternal(session, (request as any).body as Role);
  }

  // @Authenticated()
  @Get('/')
  public find(
    @Required() @Session() session: ISession,
  ): Promise<FindResult<Role>> {
    return super.findInternal(session);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Required() @Session() session: ISession,
    @PathParams('id') id: number
    ): Promise<FindByIdResult<Role, number>> {
    return super.findByIdInternal(session, id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<QueryResult<Role>> {
    return super.queryInternal(session, (request as any).body as IQuery);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Required() @Session() session: ISession,
    @Request() request: Express.Request
    ): Promise<UpdateResult<Role, number>> {
    return super.updateInternal(session, (request as any).body as Role);
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