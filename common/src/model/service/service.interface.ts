import { IServiceCrud } from './service-crud.interface';
import { IServiceBase } from './serviceBase.interface';

/**
 * Interface für alle Services
 */
// tslint:disable-next-line:no-empty-interface
export interface IService<T, TId> extends IServiceCrud<T, TId>, IServiceBase<T, TId> {
}