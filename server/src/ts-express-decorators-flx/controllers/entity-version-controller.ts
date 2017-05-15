import {  Controller, Get, PathParams } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, FindByIdServiceResult, FindServiceResult } from '@fluxgate/common';

import { EntityVersionService } from '../services/entityVersion.service';
import { FindController } from './base/find-controller';


@Controller('/' + EntityVersion.TABLE_NAME)
export class EntityVersionController extends FindController<EntityVersion, string> {
  constructor(service: EntityVersionService) {
    super(service, service.tableName, service.idColumnName);
  }


  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<FindServiceResult<EntityVersion>> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: string
    ): Promise<FindByIdServiceResult<EntityVersion, string>> {
    return super.findByIdInternal(id);
  }

}