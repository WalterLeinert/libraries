import { Injectable, Optional } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { AppConfigService, CoreService, MetadataService, Service, ServiceCore } from '@fluxgate/client';
import {
  ConfigBase, CreateResult, DeleteResult, FindByIdResult, FindResult, IServiceBase,
  ServiceConstants, StatusFilter,
  TableMetadata, TableService, UpdateResult
} from '@fluxgate/common';
import { Assert, Core, Funktion, InvalidOperationException, Types } from '@fluxgate/core';

import { SystemConfigService } from './system-config.service';


/**
 * Service für REST-Api für Entities mit der Basisklasse @see{ConfigBase}.
 *
 * Das Topic 'config' muss explizit angegeben werden, da ConfigBase nur eine abstrakte Klasse ist.
 *
 * @export
 * @class ConfigService
 * @extends {Service<ConfigBase, string>}
 */
@Injectable()
@TableService(ConfigBase)
export class ConfigService<T extends ConfigBase> extends Service<T, string> {

  constructor(metadataService: MetadataService, http: Http, configService: AppConfigService,
    private systemConfigService: SystemConfigService) {
    super(ConfigBase, metadataService, http, configService, 'config');
  }

  public getTableName(): string {
    return this.systemConfigService.getTableName();
  }
}