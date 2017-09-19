import { IToString } from '@fluxgate/core';

import { IEntity } from '../../model/entity.interface';
import { ExtendedCrudServiceRequests } from '../service-requests/extended-crud-service-requests';
import { IExtendedCrudServiceState } from '../state/extended-crud-service-state.interface';
import { CommandStore } from './command-store';

/**
 * generischer CommandStore für spezielle Verwendung: z.B. um mehrfach unabhängige Stores über demselben
 * Parent-Store zu erzeugen
 *
 * @export
 * @class GenericStore
 * @extends {CommandStore<IExtendedCrudServiceState<IRole, number>>}
 */
export class GenericStore<T extends IEntity<TId>, TId extends IToString>
  extends CommandStore<IExtendedCrudServiceState<T, TId>> {

  constructor(storeId: string = CommandStore.NO_ID, parent?: CommandStore<IExtendedCrudServiceState<T, TId>>) {
    super(storeId, ExtendedCrudServiceRequests.INITIAL_STATE, parent);
  }
}