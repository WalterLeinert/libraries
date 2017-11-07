import { Authenticated, Controller, PathParams, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, IStatusQuery, IUser,
  QueryResult,
  StatusFilter, UpdateResult
} from '@fluxgate/common';

import { UserService } from '../services/user.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';
import { CreateMethod } from './decorator/create-method.decorator';
import { DeleteMethod } from './decorator/delete-method.decorator';
import { FindByIdMethod } from './decorator/find-by-id-method.decorator';
import { FindMethod } from './decorator/find-method.decorator';
import { QueryMethod } from './decorator/query-method.decorator';
import { UpdateMethod } from './decorator/update-method.decorator';


// tslint:disable-next-line:max-classes-per-file
@Controller('/user')
export class UserController extends ControllerBase<IUser, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<IUser>
    ): Promise<CreateResult<IUser, number>> {
    return super.createInternal(request);
  }


  // @Authenticated()
  @FindMethod()
  public find(
    @Request() request: IBodyRequest<StatusFilter>
    ): Promise<FindResult<IUser>> {
    return super.findInternal(request);
  }

  // @Authenticated()
  @FindByIdMethod()
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
    ): Promise<FindByIdResult<IUser, number>> {
    return super.findByIdInternal(request, id);
  }


  @Authenticated({ role: 'admin' })
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IStatusQuery>
    ): Promise<QueryResult<IUser>> {
    return super.queryInternal(request);
  }


  @Authenticated({ role: 'admin' })
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<IUser>
    ): Promise<UpdateResult<IUser, number>> {
    return super.updateInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @DeleteMethod()
  public delete(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
    ): Promise<DeleteResult<number>> {
    return super.deleteInternal(request, id);
  }
}
