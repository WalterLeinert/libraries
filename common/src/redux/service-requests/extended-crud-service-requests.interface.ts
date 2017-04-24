import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { ICrudServiceRequests } from './crud-service-requests.interface';
import { ICurrentItemServiceRequests } from './current-item-service-requests.interface';

export interface IExtendedCrudServiceRequests<T extends IEntity<TId>, TId extends IToString>
  extends ICrudServiceRequests<T, TId>, ICurrentItemServiceRequests<T, TId> {

}