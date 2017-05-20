import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  UpdateResult, User
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { UserService } from '../services/user.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';


@Controller('/user')
export class UserController extends ControllerBase<User, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: IBodyRequest<User>
    ): Promise<CreateResult<User, number>> {
    return super.createInternal(request);
  }


  // @Authenticated()
  @Get('/')
  public find(
    @Request() request: ISessionRequest
    ): Promise<FindResult<User>> {
    return super.findInternal(request);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
    ): Promise<FindByIdResult<User, number>> {
    return super.findByIdInternal(request, id);
  }


  @Authenticated({ role: 'admin' })
  @Post('/')
  public query(
    @Request() request: IBodyRequest<IQuery>
    ): Promise<QueryResult<User>> {
    return super.queryInternal(request);
  }


  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: IBodyRequest<User>
    ): Promise<UpdateResult<User, number>> {
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