import { Controller, Get, PathParams, Required, Session } from 'ts-express-decorators';

// Fluxgate
import { EntityVersion, FindByIdResult, FindResult } from '@fluxgate/common';

import { EntityVersionService } from '../services/entityVersion.service';
import { ISession } from '../session/session.interface';
import { ReadonlyController } from './base/readonly-controller';


@Controller('/' + EntityVersion.TABLE_NAME)
export class EntityVersionController extends ReadonlyController<EntityVersion, string> {
  constructor(service: EntityVersionService) {
    super(service, service.tableName, service.idColumnName);
  }


  // @Authenticated()
  @Get('/')
  public find(
    @Required() @Session() session: ISession,
  ): Promise<FindResult<EntityVersion>> {
    return super.findInternal(session);
  }

  // @Authenticated()
  @Get('/:id')
  public findById(
    @Required() @Session() session: ISession,
    @PathParams('id') id: string
    ): Promise<FindByIdResult<EntityVersion, string>> {
    return super.findByIdInternal(session, id);
  }

}