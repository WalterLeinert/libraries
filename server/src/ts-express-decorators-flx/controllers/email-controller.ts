import {
  Authenticated, Controller, Put, Request
} from 'ts-express-decorators';

// Fluxgate
import {
  IMessage
} from '@fluxgate/common';

import { EmailService } from '../services/email/email.service';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';


@Controller('/email')
export class EmailController extends ControllerCore {

  constructor(service: EmailService) {
    super(service);
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