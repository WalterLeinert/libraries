import {
  Authenticated, Controller, Put, Request
} from 'ts-express-decorators';

// Fluxgate
import {
  IMessage
} from '@fluxgate/common';

import { SystemConfigService } from '../services/system-config.service';
import { ISessionRequest } from '../session/session-request.interface';
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