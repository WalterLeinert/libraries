import { ServiceProxy } from '../../model/service/service-proxy';
import { IService } from '../../model/service/service.interface';

/**
 * ServiceProxy, der einen Entity-Cache implementiert.
 *
 * @export
 * @class CacheProxy
 */
export class CacheProxy extends ServiceProxy<any, any> {

  constructor(service: IService<any, any>) {
    super(service);
  }
}