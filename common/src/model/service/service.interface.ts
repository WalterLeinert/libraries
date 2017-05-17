import { IEntity } from '../entity.interface';
import { IServiceCrud } from './service-crud.interface';
import { IServiceBase } from './serviceBase.interface';

/**
 * Interface für alle Services
 */
// tslint:disable-next-line:no-empty-interface
export interface IService<T extends IEntity<TId>, TId> extends IServiceCrud<T, TId>, IServiceBase<T, TId> {
}