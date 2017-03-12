import {
  Authenticated, Controller, Delete, Get,
  PathParams, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import { IUser, NotSupportedException, ServiceResult, User } from '@fluxgate/common';

import { UserService } from '../../services/user.service';
import { ControllerBase } from '../controllerBase';


@Controller('/user')
export class UserController extends ControllerBase<IUser, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<User[]> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: number
    ): Promise<User> {
    return super.findByIdInternal(id);
  }

  @Authenticated()
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<User> {
    throw new NotSupportedException();
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<ServiceResult<number>> {
    throw new NotSupportedException();
  }
}