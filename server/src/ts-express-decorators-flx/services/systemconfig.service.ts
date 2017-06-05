import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { AppRegistry, ISystemConfig, SystemConfig } from '@fluxgate/common';

import { Messages } from '../../resources/messages';
import { ISessionRequest } from '../session/session-request.interface';
import { BaseService } from './baseService';
import { KnexService } from './knex.service';
import { MetadataService } from './metadata.service';

import { Assert, Encryption, Funktion, IQuery, SelectorTerm, Types } from '@fluxgate/core';

@Service()
export class SystemConfigService extends BaseService<ISystemConfig, number> {

  constructor(knexSerice: KnexService, metadataService: MetadataService) {
    super(AppRegistry.instance.get<Funktion>(SystemConfig.SYSTEMCONFIG_CONFIG_KEY), knexSerice, metadataService);
  }

  /**
   * Liefert einen @see{SystemConfig} für den Namen @param{name} als @see{Promise}
   *
   * @param {string} name
   * @returns {Promise<SystemConfig>}
   *
   * @memberOf UserService
   */
  public findByName(request: ISessionRequest, name: string): Promise<ISystemConfig> {
    return using(new XLog(SystemConfigService.logger, levels.INFO, 'findByName', `name = ${name}`), (log) => {
      const query: IQuery = {
        term: new SelectorTerm({
          name: 'name',
          operator: '=',
          value: name
        })
      };

      return new Promise<ISystemConfig>((resolve, reject) => {
        this.query(request, query)
          .then((result) => {
            if (Types.isNullOrEmpty(result.items)) {
              log.log('no systemconfig found');
              resolve(undefined);
            } else {
              const systemconfig = result.items[0];
              log.log('systemconfig: ', systemconfig);
              resolve(systemconfig);
            }

          })
          .catch((err) => {
            log.error(err);
            reject(this.createSystemException(err));
          });
      });
    });
  }


}