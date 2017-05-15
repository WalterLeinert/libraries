import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import {
  CreateServiceResult, DeleteServiceResult, FindByIdServiceResult, FindServiceResult, QueryServiceResult,
  Role, UpdateServiceResult
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { RoleService } from '../services/role.service';
import { ControllerBase } from './base/controllerBase';


@Controller('/role')
export class RoleController extends ControllerBase<Role, number> {
  constructor(service: RoleService) {
    super(service, 'role', 'role_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: Express.Request
    ): Promise<CreateServiceResult<Role>> {
    return super.createInternal((request as any).body as Role);
  }

  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<FindServiceResult<Role>> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: number
    ): Promise<FindByIdServiceResult<Role, number>> {
    return super.findByIdInternal(id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<QueryServiceResult<Role>> {
    return super.queryInternal((request as any).body as IQuery);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<UpdateServiceResult<Role>> {
    return super.updateInternal((request as any).body as Role);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<DeleteServiceResult<number>> {
    return super.deleteInternal(id);
  }
}