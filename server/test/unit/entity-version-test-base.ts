// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


import {
  AppConfig, AppRegistry, IEntity
} from '@fluxgate/common';

import { Clone, ICtor, IToString } from '@fluxgate/core';


import { KnexTest } from './knex-test';


/**
 * abstrakte Basisklasse für Tests, die mit der EntityVersion arbeiten (proxyMode: 'entityVersion')
 *
 * @export
 * @abstract
 * @class EntityVersionTestBase
 * @extends {KnexTest<T, TId>}
 * @template T
 * @template TId
 */
export abstract class EntityVersionTestBase<T extends IEntity<TId>, TId extends IToString> extends KnexTest<T, TId> {

  public before(done?: (err?: any) => void) {
    super.before(() => {

      // für Tests eine App-Config simulieren
      AppRegistry.instance.add(AppConfig.APP_CONFIG_KEY,
        {
          url: 'dummy',
          printUrl: 'dummy',
          printTopic: '',
          mode: 'local',
          proxyMode: 'entityVersion'    // wichtig
        }, true
      );

      done();
    });
  }

  public after(done?: (err?: any) => void) {
    super.after(() => {
      AppConfig.unregister();
      done();
    });
  }

}