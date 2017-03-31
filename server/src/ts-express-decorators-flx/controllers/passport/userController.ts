import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import { IUser, ServiceResult, User } from '@fluxgate/common';

import { UserService } from '../../services/user.service';
import { ControllerBase } from '../controllerBase';


@Controller('/user')
export class UserController extends ControllerBase<IUser, number> {
  constructor(service: UserService) {
    super(service, 'user', 'user_id');
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: Express.Request
    ): Promise<User> {
    return super.createInternal((request as any).body as User);
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

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<User> {
    return super.updateInternal((request as any).body as User);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<ServiceResult<number>> {
    return super.deleteInternal(id);
  }
}