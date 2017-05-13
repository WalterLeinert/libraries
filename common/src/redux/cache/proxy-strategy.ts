import { Assert, NotSupportedException } from '@fluxgate/core';

import { EntityVersion } from '../../model/entityVersion';
import { IService } from '../../model/service/service.interface';
import { CacheProxy } from './cache-proxy';
import { EntityVersionProxy } from './entity-version-proxy';
import { NopProxy } from './nop-proxy';
import { Strategies, Strategy } from './strategy';


/**
 *
 *
 * @export
 * @class ProxyFactory
 */
export class ProxyFactory {

  public static createProxy<T, TId>(strategy: Strategy, service: IService<T, TId>,
    entityVersionService: IService<EntityVersion, string>): IService<T, TId> {
    Assert.notNull(strategy);
    Assert.notNull(service);

    switch (strategy) {
      case Strategies.NOP:
        return new NopProxy(service);

      case Strategies.CACHE:
        return new CacheProxy(service);

      case Strategies.SERVICE:
        return new EntityVersionProxy(service, entityVersionService);

      default:
        throw new NotSupportedException(`strategy not supported: ${strategy}`);
    }
  }
}