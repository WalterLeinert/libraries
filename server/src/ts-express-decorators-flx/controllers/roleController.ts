import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import { Role, ServiceResult } from '@fluxgate/common';

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
    ): Promise<Role> {
    return super.createInternal((request as any).body as Role);
  }

  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<Role[]> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: number
    ): Promise<Role> {
    return super.findByIdInternal(id);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<Role> {
    return super.updateInternal((request as any).body as Role);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: number
    ): Promise<ServiceResult<number>> {
    return super.deleteInternal(id);
  }
}