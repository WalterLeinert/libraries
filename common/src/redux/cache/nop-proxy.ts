import { IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';

/**
 * ServiceProxy, der alle Servicecalls direkt zum eigentlichen Service weiterleitet (keine Optimierung, kein Cache)
 *
 * @export
 * @class NopProxy
 */
export class NopProxy<T extends IEntity<TId>, TId extends IToString> extends ServiceProxy<T, TId> {

  constructor(service: IService<any, any>) {
    super(service);
  }
}