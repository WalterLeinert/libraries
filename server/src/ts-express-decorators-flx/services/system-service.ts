// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { ISystemConfig } from '@fluxgate/common';
import { Assert, JsonSerializer } from '@fluxgate/core';

import { SystemConfigService } from './system-config.service';


/**
 * Klasse zum Ermitteln einer Systemkonfiguration
 *
 * @export
 * @class SystemService
 */
export abstract class SystemService<TConfig> {
  protected static readonly logger = getLogger(SystemService);

  private serializer: JsonSerializer = new JsonSerializer();

  private _config: TConfig;

  protected constructor(private systemConfigService: SystemConfigService, configKey: string) {
    Assert.notNull(systemConfigService);
    Assert.notNullOrEmpty(configKey);

    this.systemConfigService.findById<ISystemConfig>(null, configKey)
      .then((result) => {
        // ok
        // this._config = JSON.parse(result.item.json) as TConfig;
        // this._config = this.deserialize<TConfig>(JSON.parse(result.item.json));
      });
  }

  protected get config(): TConfig {
    return this._config;
  }

  protected deserialize<T>(json: any): T {
    Assert.notNull(json);
    return this.serializer.deserialize<T>(json);
  }
}