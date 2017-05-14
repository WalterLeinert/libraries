import {
  Authenticated, Controller, Delete, Get,
  PathParams, Post, Put,
  Request
} from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, ServiceResult } from '@fluxgate/common';

import { EntityVersionService } from '../services/entityVersion.service';
import { ControllerBase } from './base/controllerBase';


@Controller('/' + EntityVersion.TABLE_NAME)
export class EntityVersionController extends ControllerBase<EntityVersion, string> {
  constructor(service: EntityVersionService) {
    super(service, service.tableName, service.idColumnName);
  }

  @Authenticated({ role: 'admin' })
  @Post('/')
  public create(
    @Request() request: Express.Request
    ): Promise<EntityVersion> {
    return super.createInternal((request as any).body as EntityVersion);
  }

  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<EntityVersion[]> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: string
    ): Promise<EntityVersion> {
    return super.findByIdInternal(id);
  }

  @Authenticated({ role: 'admin' })
  @Put('/')
  public update(
    @Request() request: Express.Request
    ): Promise<EntityVersion> {
    return super.updateInternal((request as any).body as EntityVersion);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @PathParams('id') id: string
    ): Promise<ServiceResult<string>> {
    return super.deleteInternal(id);
  }
}