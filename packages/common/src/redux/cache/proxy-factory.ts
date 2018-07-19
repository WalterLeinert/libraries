import { Assert, IToString, NotSupportedException, Types } from '@fluxgate/core';

import { AppConfig, IAppConfig } from '../../base/appConfig';
import { AppRegistry } from '../../base/appRegistry';
import { IEntity } from '../../model/entity.interface';
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


  /**
   * Erzeugt einen konkreten ServiceProxy.
   *
   * @static
   * @template T
   * @template TId
   * @param {IReadonlyService<T, TId>} service
   * @param {IService<EntityVersion, string>} entityVersionService
   * @returns {IService<T, TId>}
   *
   * @memberof ProxyFactory
   */
  public static createProxy<T extends IEntity<TId>, TId extends IToString,
    TService extends IService<any, any>>(service: TService,
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
        return new NopProxy<T, TId>(service);

      case ProxyModes.CACHE:
        return new CacheProxy<T, TId>(service as IService<T, TId>);

      case ProxyModes.ENTITY_VERSION:
        return new EntityVersionProxy<T, TId>(service as IService<T, TId>, entityVersionService);

      default:
        throw new NotSupportedException(`proxyMode not supported: ${proxyMode}`);
    }
  }

}