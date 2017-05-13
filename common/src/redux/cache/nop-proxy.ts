import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';

/**
 * ServiceProxy, der alle Servicecalls direkt zum eigentlichen Service weiterleitet (keine Optimierung, kein Cache)
 *
 * @export
 * @class NopProxy
 */
export class NopProxy extends ServiceProxy<any, any> {

  constructor(service: IService<any, any>) {
    super(service);
  }
}