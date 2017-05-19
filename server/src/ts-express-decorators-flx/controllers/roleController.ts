import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  Role, UpdateResult
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
    ): Promise<CreateResult<Role, number>> {
    return super.createInternal((request as any).body as Role);
  }

  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<FindResult<Role>> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: number
    ): Promise<FindByIdResult<Role, number>> {
    return super.findByIdInternal(id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<QueryResult<Role>> {
    return super.queryInternal((request as any).body as IQuery);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<UpdateResult<Role, number>> {
    return super.updateInternal((request as any).body as Role);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<DeleteResult<number>> {
    return super.deleteInternal(id);
  }
}