import { Authenticated, Controller, Delete, Get, PathParams, Post, Put, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, IStatusQuery, QueryResult,
  Role, ServiceConstants, StatusFilter, UpdateResult
} from '@fluxgate/common';

import { RoleService } from '../services/role.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';


@Controller('/role')
export class RoleController extends ControllerBase<Role, number> {
  constructor(service: RoleService) {
    super(service, 'role', 'role_id');
  }

  @Authenticated({ role: 'admin' })
  @Post(`/${ServiceConstants.CREATE}`)
  public create(
    @Request() request: IBodyRequest<Role>
    ): Promise<CreateResult<Role, number>> {
    return super.createInternal(request);
  }

  // @Authenticated()
  @Post(`/${ServiceConstants.FIND}`)
  public find(
    @Request() request: IBodyRequest<StatusFilter>
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
  @Post(`/${ServiceConstants.QUERY}`)
  public query(
    @Request() request: IBodyRequest<IStatusQuery>
    ): Promise<QueryResult<Role>> {
    return super.queryInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @Put(`/${ServiceConstants.UPDATE}`)
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