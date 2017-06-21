import { Authenticated, Controller, PathParams, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult,
  SystemConfig, UpdateResult
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';

import { SystemConfigService } from '../services/system-config.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';
import { CreateMethod } from './decorator/create-method.decorator';
import { DeleteMethod } from './decorator/delete-method.decorator';
import { FindByIdMethod } from './decorator/find-by-id-method.decorator';
import { FindMethod } from './decorator/find-method.decorator';
import { QueryMethod } from './decorator/query-method.decorator';
import { UpdateMethod } from './decorator/update-method.decorator';


@Controller('/systemconfig')
export class SystemConfigController extends ControllerBase<SystemConfig, any> {
  constructor(service: SystemConfigService) {
    super(service, 'systemconfig', 'systemconfig_id');
  }

  @Authenticated({ systemconfig: 'admin' })
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<SystemConfig>
    ): Promise<CreateResult<SystemConfig, string>> {
    return super.createInternal(request);
  }

  @Authenticated()
  @FindMethod()
  public find(
    @Request() request: ISessionRequest
    ): Promise<FindResult<SystemConfig>> {
    return super.findInternal(request);
  }

  @Authenticated()
  @FindByIdMethod()
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: string
    ): Promise<FindByIdResult<SystemConfig, string>> {
    return super.findByIdInternal(request, id);
  }

  @Authenticated({ systemconfig: 'admin' })
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IQuery>
    ): Promise<QueryResult<SystemConfig>> {
    return super.queryInternal(request);
  }

  @Authenticated({ systemconfig: 'admin' })
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<SystemConfig>
    ): Promise<UpdateResult<SystemConfig, string>> {
    return super.updateInternal(request);
  }

  @Authenticated({ systemconfig: 'admin' })
  @DeleteMethod()
  public delete(
    @Request() request: ISessionRequest,
    @PathParams('id') id: string
    ): Promise<DeleteResult<string>> {
    return super.deleteInternal(request, id);
  }
}