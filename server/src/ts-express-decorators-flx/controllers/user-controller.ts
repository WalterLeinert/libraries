import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, IStatusQuery, QueryResult,
  ServiceConstants, StatusFilter,
  UpdateResult, User
} from '@fluxgate/common';

import { UserService } from '../services/user.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';


// tslint:disable-next-line:max-classes-per-file
@Controller('/user')
export class UserController extends ControllerBase<User, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @Post(`/${ServiceConstants.CREATE}`)
  public create(
    @Request() request: IBodyRequest<User>
    ): Promise<CreateResult<User, number>> {
    return super.createInternal(request);
  }


  // @Authenticated()
  @Post(`/${ServiceConstants.FIND}`)
  public find(
    @Request() request: IBodyRequest<StatusFilter>
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
  @Post(`/${ServiceConstants.QUERY}`)
  public query(
    @Request() request: IBodyRequest<IStatusQuery>
    ): Promise<QueryResult<User>> {
    return super.queryInternal(request);
  }


  @Authenticated({ role: 'admin' })
  @Put(`/${ServiceConstants.UPDATE}`)
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