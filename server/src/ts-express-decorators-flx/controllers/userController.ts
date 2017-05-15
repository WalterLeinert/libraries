import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import {
  CreateServiceResult, DeleteServiceResult, FindByIdServiceResult, FindServiceResult, QueryServiceResult,
  UpdateServiceResult, User
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { UserService } from '../services/user.service';
import { ControllerBase } from './base/controllerBase';


@Controller('/user')
export class UserController extends ControllerBase<User, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: Express.Request
    ): Promise<CreateServiceResult<User>> {
    return super.createInternal((request as any).body as User);
  }


  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<FindServiceResult<User>> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: number
    ): Promise<FindByIdServiceResult<User, number>> {
    return super.findByIdInternal(id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Request() request: Express.Request
    ): Promise<QueryServiceResult<User>> {
    return super.queryInternal((request as any).body as IQuery);
  }


  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<UpdateServiceResult<User>> {
    return super.updateInternal((request as any).body as User);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<DeleteServiceResult<number>> {
    return super.deleteInternal(id);
  }
}