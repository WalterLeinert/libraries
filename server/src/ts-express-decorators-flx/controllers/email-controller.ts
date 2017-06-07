import {
  Authenticated, Controller, Get, Put, Request
} from 'ts-express-decorators';

// Fluxgate
import {
  FindResult, IMessage, ISystemConfig
} from '@fluxgate/common';

import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';

import { SystemConfigService } from '../services/system-config.service';
import { SystemConfigController } from './systemconfig-controller';



@Controller('/email')
export class EmailController extends SystemConfigController {

  constructor(systemConfigService: SystemConfigService) {
    super(systemConfigService);
  }

  @Authenticated()
  @Put('/')
  public send(
    @Request() request: ISessionRequest,
    message: IMessage
    ): Promise<any> {
    return this.send(request, message);
  }

}