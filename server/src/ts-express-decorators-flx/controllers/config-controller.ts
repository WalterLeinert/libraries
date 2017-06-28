import { Authenticated, Controller, PathParams, QueryParams, Request } from 'ts-express-decorators';

// Fluxgate
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, StatusFilter, UpdateResult
} from '@fluxgate/common';

import { ConfigService } from '../services/config.service';
import { IBodyRequest } from '../session/body-request.interface';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';
import { CreateMethod } from './decorator/create-method.decorator';
import { DeleteMethod } from './decorator/delete-method.decorator';
import { FindByIdMethod } from './decorator/find-by-id-method.decorator';
import { FindMethod } from './decorator/find-method.decorator';
import { UpdateMethod } from './decorator/update-method.decorator';

/**
 * genericher Controller für
 *
 * @export
 * @class ConfigController
 * @extends {ControllerBase<SystemConfig, string>}
 */
@Controller('/config')
export class ConfigController extends ControllerCore {

  constructor(service: ConfigService) {
    super(service);
  }


  @Authenticated()
  @FindMethod()
  public find(
    @Request() request: IBodyRequest<StatusFilter>,
    @QueryParams('model') model: string
    ): Promise<FindResult<ConfigBase>> {
    return Promise.resolve()
      .then(() => this.deserialize<StatusFilter>(request.body))
      .then((deserializedFilter) => this.getService().find(request, model, deserializedFilter))
      .then<FindResult<ConfigBase>>((result) => this.serialize(result));
  }


  @Authenticated()
  @FindByIdMethod()
  public findById(
    @Request() request: ISessionRequest,
    @QueryParams('model') model: string,
    @PathParams('id') id: string
    ): Promise<FindByIdResult<ConfigBase, string>> {
    return Promise.resolve()
      .then(() => this.getService().findById(request, model, id))
      .then<FindByIdResult<ConfigBase, string>>((result) => this.serialize(result));
  }


  @Authenticated({ role: 'admin' })
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<ConfigBase>,
    @QueryParams('model') model: string
    ): Promise<CreateResult<ConfigBase, string>> {
    return Promise.resolve()
      .then(() => this.deserialize<ConfigBase>(request.body))
      .then((deserializedSubject) => this.getService().create(request, model, deserializedSubject))
      .then<CreateResult<ConfigBase, string>>((result) => this.serialize(result));
  }


  @Authenticated({ role: 'admin' })
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<ConfigBase>,
    @QueryParams('model') model: string
    ): Promise<UpdateResult<ConfigBase, string>> {
    return Promise.resolve()
      .then(() => this.deserialize<ConfigBase>(request.body))
      .then((deserializedSubject) => this.getService().update(request, model, deserializedSubject))
      .then<UpdateResult<ConfigBase, string>>((result) => this.serialize(result));
  }


  @Authenticated({ role: 'admin' })
  @DeleteMethod()
  public delete(
    @Request() request: ISessionRequest,
    @QueryParams('model') model: string,
    @PathParams('id') id: string
    ): Promise<DeleteResult<string>> {
    return Promise.resolve()
      .then(() => this.getService().delete(request, model, id))
      .then<DeleteResult<string>>((result) => this.serialize(result));
  }


  protected getService(): ConfigService {
    return super.getService() as ConfigService;
  }
}