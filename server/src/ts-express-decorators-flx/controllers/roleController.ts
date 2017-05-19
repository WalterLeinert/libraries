import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  Role, UpdateResult
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { RoleService } from '../services/role.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controllerBase';


@Controller('/role')
export class RoleController extends ControllerBase<Role, number> {
  constructor(service: RoleService) {
    super(service, 'role', 'role_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: IBodyRequest<Role>
    ): Promise<CreateResult<Role, number>> {
    return super.createInternal(request);
  }

  // @Authenticated()
  @Get('/')
  public find(
    @Request() request: ISessionRequest
    ): Promise<FindResult<Role>> {
    return super.findInternal(request);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
    ): Promise<FindByIdResult<Role, number>> {
    return super.findByIdInternal(request, id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Request() request: IBodyRequest<IQuery>
    ): Promise<QueryResult<Role>> {
    return super.queryInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: IBodyRequest<Role>
    ): Promise<UpdateResult<Role, number>> {
    return super.updateInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
    ): Promise<DeleteResult<number>> {
    return super.deleteInternal(request, id);
  }
}