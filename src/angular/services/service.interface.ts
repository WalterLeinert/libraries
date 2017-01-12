import { IServiceBase } from './serviceBase.interface';
import { IServiceCrud } from './serviceCrud.interface';


/**
 * Interface für alle Services
 */
export interface IService extends IServiceCrud, IServiceBase {
}