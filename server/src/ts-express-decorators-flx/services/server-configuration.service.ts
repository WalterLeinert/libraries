import { Service } from 'ts-express-decorators';

// fluxgate
import { } from '@fluxgate/core';

import { IServerConfiguration } from '../server-configuration.interface';

/**
 * Service für den Zugriff auf die Server-Konfiguration
 */
@Service()
export class ServerConfigurationService {
  private _configuration: IServerConfiguration;

  public register(configuration: IServerConfiguration) {
    this._configuration = configuration;
  }

  public get(): IServerConfiguration {
    return this._configuration;
  }
}