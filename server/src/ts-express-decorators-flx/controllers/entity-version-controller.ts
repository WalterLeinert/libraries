import { Controller, Get, PathParams, Request } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, FindByIdResult, FindResult } from '@fluxgate/common';

import { EntityVersionService } from '../services/entityVersion.service';
import { ISessionRequest } from '../session/session-request.interface';
import { ReadonlyController } from './base/readonly-controller';


@Controller('/' + EntityVersion.TABLE_NAME)
export class EntityVersionController extends ReadonlyController<EntityVersion, string> {
  constructor(service: EntityVersionService) {
    super(service, service.tableName, service.idColumnName);
  }


  // @Authenticated()
  @Get('/')
  public find(
    @Request() request: ISessionRequest
  ): Promise<FindResult<EntityVersion>> {
    return super.findInternal(request);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: string
    ): Promise<FindByIdResult<EntityVersion, string>> {
    return super.findByIdInternal(request, id);
  }

}