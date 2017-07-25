import { Authenticated, Controller, PathParams, QueryParams, Request } from 'ts-express-decorators';

// Fluxgate
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, IStatusQuery, QueryResult,
  StatusFilter, UpdateResult
} from '@fluxgate/common';

import { ConfigService } from '../services/config.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerBase } from './base/controller-base';
import { ControllerCore } from './base/controller-core';
import { CreateMethod } from './decorator/create-method.decorator';
import { DeleteMethod } from './decorator/delete-method.decorator';
import { FindByIdMethod } from './decorator/find-by-id-method.decorator';
import { FindMethod } from './decorator/find-method.decorator';
import { QueryMethod } from './decorator/query-method.decorator';
import { UpdateMethod } from './decorator/update-method.decorator';

/**
 * generischer Controller für Konfigurationsdaten.
 *
 * @export
 * @class ConfigController
 * @extends {ControllerBase<ConfigBase, string>}
 */
@Controller('/config')
export class ConfigController extends ControllerBase<ConfigBase, string> {
  constructor(service: ConfigService) {
    super(service, 'systemconfig', 'systemconfig_id');
  }

  @Authenticated({ role: 'admin' })
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<ConfigBase>
    ): Promise<CreateResult<ConfigBase, string>> {
    return super.createInternal(request);
  }

  // @Authenticated()
  @FindMethod()
  public find(
    @Request() request: IBodyRequest<StatusFilter>
    ): Promise<FindResult<ConfigBase>> {
    return super.findInternal(request);
  }

  // @Authenticated()
  @FindByIdMethod()
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: string
    ): Promise<FindByIdResult<ConfigBase, string>> {
    return super.findByIdInternal(request, id);
  }


  @Authenticated({ role: 'admin' })
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IStatusQuery>
    ): Promise<QueryResult<ConfigBase>> {
    return super.queryInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<ConfigBase>
    ): Promise<UpdateResult<ConfigBase, string>> {
    return super.updateInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @DeleteMethod()
  public delete(
    @Request() request: ISessionRequest,
    @PathParams('id') id: string
    ): Promise<DeleteResult<string>> {
    return super.deleteInternal(request, id);
  }
}