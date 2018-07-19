import {
  Authenticated, Controller, Put, Request
} from 'ts-express-decorators';

// Fluxgate
import { IMailMessage } from '@fluxgate/common';

import { EmailService } from '../services/email/email.service';
import { ISessionRequest } from '../session/session-request.interface';
import { ControllerCore } from './base/controller-core';


@Controller('/email')
export class EmailController extends ControllerCore {

  constructor(private service: EmailService) {
    super(service);
  }

  @Authenticated()
  @Put('/')
  public send(
    @Request() request: ISessionRequest,
    message: IMailMessage
    ): Promise<any> {
    return this.service.send(message);
  }
}