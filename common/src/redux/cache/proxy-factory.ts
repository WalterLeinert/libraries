import { Assert, NotSupportedException, Types } from '@fluxgate/core';

import { AppConfig, IAppConfig } from '../../base/appConfig';
import { AppRegistry } from '../../base/appRegistry';
import { EntityVersion } from '../../model/entityVersion';
import { IService } from '../../model/service/service.interface';
import { CacheProxy } from './cache-proxy';
import { EntityVersionProxy } from './entity-version-proxy';
import { NopProxy } from './nop-proxy';
import { ProxyModes } from './proxy-mode';


/**
 *
 *
 * @export
 * @class ProxyFactory
 */
export class ProxyFactory {

  public static createProxy<T, TId>(service: IService<T, TId>,
    entityVersionService: IService<EntityVersion, string>): IService<T, TId> {
    Assert.notNull(service);

    let proxyMode = ProxyModes.NOP;

    const config = AppRegistry.instance.get<IAppConfig>(AppConfig.APP_CONFIG_KEY);
    if (config) {
      if (Types.isPresent(config.proxyMode)) {
        proxyMode = config.proxyMode;
      }
    }


    switch (proxyMode) {
      case ProxyModes.NOP:
        return new NopProxy(service);

      case ProxyModes.CACHE:
        return new CacheProxy(service);

      case ProxyModes.SERVICE:
        return new EntityVersionProxy(service, entityVersionService);

      default:
        throw new NotSupportedException(`strategy not supported: ${proxyMode}`);
    }
  }
}