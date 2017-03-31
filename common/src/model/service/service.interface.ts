import { IServiceBase } from './serviceBase.interface';
import { IServiceCrud } from './serviceCrud.interface';

/**
 * Interface für alle Services
 */
// tslint:disable-next-line:no-empty-interface
export interface IService extends IServiceCrud, IServiceBase {
}