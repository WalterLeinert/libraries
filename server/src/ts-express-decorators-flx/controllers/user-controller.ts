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
import { CreateMethod } from './decorator/create-method.decorator';
import { FindMethod } from './decorator/find-method.decorator';
import { QueryMethod } from './decorator/query-method.decorator';
import { UpdateMethod } from './decorator/update-method.decorator';


// tslint:disable-next-line:max-classes-per-file
@Controller('/user')
export class UserController extends ControllerBase<User, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<User>
    ): Promise<CreateResult<User, number>> {
    return super.createInternal(request);
  }


  // @Authenticated()
  @FindMethod()
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
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IStatusQuery>
    ): Promise<QueryResult<User>> {
    return super.queryInternal(request);
  }


  @Authenticated({ role: 'admin' })
  @UpdateMethod()
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