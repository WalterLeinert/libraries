import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { ConfigService, MetadataService, Service } from '@fluxgate/client';
import { ConfigBase, SmtpConfig, SystemConfig, TableService } from '@fluxgate/common';
import { IToString } from '@fluxgate/core';


/**
 * Service für REST-Api für Entity @see{SystemConfig}.
 *
 * @export
 * @class ConfigSystemService
 * @extends {Service<ConfigBase, string>}
 */
@Injectable()
@TableService(SmtpConfig)
export class ConfigSystemService extends Service<ConfigBase, string> {

  constructor(metadataService: MetadataService, http: Http, configService: ConfigService) {
    super(ConfigBase, metadataService, http, configService);
  }

}
