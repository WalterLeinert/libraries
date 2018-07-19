import { IMiddleware, Middleware, Request } from 'ts-express-decorators';
import { NotAcceptable } from 'ts-httpexceptions';

import { ServerSettingsService } from '../services/server-settings.service';

@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {

  constructor(private serverSettingsService: ServerSettingsService) {
  }

  public use( @Request() request) {
    this.serverSettingsService.acceptMimes
      .forEach((mime) => {
        if (!request.accepts(mime)) {
          throw new NotAcceptable(mime);
        }
      });
  }
}