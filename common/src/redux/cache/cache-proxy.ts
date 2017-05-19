import { IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';

/**
 * ServiceProxy, der einen Entity-Cache implementiert.
 *
 * @export
 * @class CacheProxy
 */
export class CacheProxy<T extends IEntity<TId>, TId extends IToString> extends ServiceProxy<T, TId> {

  constructor(service: IService<any, any>) {
    super(service);
  }
}