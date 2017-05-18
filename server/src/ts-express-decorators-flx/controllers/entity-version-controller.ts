import { Controller, Get, PathParams } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, FindByIdResult, FindResult } from '@fluxgate/common';

import { EntityVersionService } from '../services/entityVersion.service';
import { ReadonlyController } from './base/readonly-controller';


@Controller('/' + EntityVersion.TABLE_NAME)
export class EntityVersionController extends ReadonlyController<EntityVersion, string> {
  constructor(service: EntityVersionService) {
    super(service, service.tableName, service.idColumnName);
  }


  // @Authenticated()
  @Get('/')
  public find(
    ): Promise<FindResult<EntityVersion>> {
    return super.findInternal();
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @PathParams('id') id: string
    ): Promise<FindByIdResult<EntityVersion, string>> {
    return super.findByIdInternal(id);
  }

}