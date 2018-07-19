import { Service } from 'ts-express-decorators';

import { Deprecated } from '@fluxgate/core';

import { ServerConfigurationService } from './server-configuration.service';

/**
 * Service für den Zugriff auf die Konfiguration des ts-express-decorator (Ts.ED) Servers
 * TODO: ist in Ts.ED 2.3.3 enthalten)
 */
@Deprecated(`beim Upgrade auf ts-express-decorators@2.3.3 entfernen`)
@Service()
export class ServerSettingsService {

  constructor(private configurationService: ServerConfigurationService) {
  }

  public get acceptMimes(): string[] {
    return this.configurationService.get().acceptMimes;
  }
}