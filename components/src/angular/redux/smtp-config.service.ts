import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, MetadataService } from '@fluxgate/client';
import {
  ConfigBase, FindByIdResult, FindResult, SmtpConfig, StatusFilter, TableService
} from '@fluxgate/common';

import { ConfigService } from './config.service';

/**
 * Service für REST-Api den Smtp-Configservice
 *
 * @export
 * @class SmtpConfigService
 * @extends {ConfigService<SmtpConfig>}
 */
@Injectable()
@TableService(ConfigBase)
export class SmtpConfigService extends ConfigService<SmtpConfig> {

  constructor(metadataService: MetadataService, http: Http, configService: AppConfigService) {
    super(metadataService, http, configService, SmtpConfig);
  }


  public findById(id: string): Observable<FindByIdResult<SmtpConfig, string>> {
    return super.findById(ConfigBase.createId(SmtpConfig.TYPE, id));
  }

  public find(filter?: StatusFilter): Observable<FindResult<ConfigBase>> {
    return super.findByType(SmtpConfig.TYPE, filter);
  }

}