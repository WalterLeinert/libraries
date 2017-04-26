import { IToString } from '@fluxgate/core';
import { IEntity } from '../../model/entity.interface';
import { IService } from '../../model/service/service.interface';
import { Store } from '../store/store';
import { CommandStore } from '../store/command-store';
import { ICommand, ItemDeletedCommand, ItemUpdatedCommand, SetCurrentItemCommand } from './../command/';
import { ICurrentItemServiceState } from './../state/current-item-service-state.interface';
import { IExtendedCrudServiceState } from './../state/extended-crud-service-state.interface';
import { IServiceState } from './../state/service-state.interface';
import { CrudServiceRequests } from './crud-service-requests';
import { IExtendedCrudServiceRequests } from './extended-crud-service-requests.interface';


/**
 * abstrakte Basisklasse für ServiceRequests, die ein "currentItem" unterstützen + CRUD-Operationen
 *
 * @export
 * @class ExtendedCrudServiceRequests
 * @template T
 * @template TId
 * @template TService
 */
export abstract class ExtendedCrudServiceRequests<T extends IEntity<TId>, TId extends IToString,
  TService extends IService<T, TId>> extends CrudServiceRequests<T, TId, TService>
  implements IExtendedCrudServiceRequests<T, TId> {

  public static readonly INITIAL_STATE: IExtendedCrudServiceState<any, any> = {
    ...CrudServiceRequests.INITIAL_STATE,
    currentItem: null
  };

  protected constructor(storeId: string | CommandStore<any>, service: TService, store: Store, parentStoreId?: string) {
    super(storeId, service, store, parentStoreId);

  }

  public setCurrent(item: T): void {
    this.dispatch(new SetCurrentItemCommand(this, item));
  }

  public getCurrentItemState(storeId: string): ICurrentItemServiceState<T, TId> {
    return super.getStoreState(storeId) as ICurrentItemServiceState<T, TId>;
  }


  public updateState(command: ICommand<IServiceState>, state: IServiceState): IServiceState {
    if (command instanceof ItemDeletedCommand) {
      const extState = state as IExtendedCrudServiceState<T, TId>;

      // currentItem ggf. zurücksetzen
      return {
        ...state,
        currentItem: (extState.currentItem && extState.currentItem.id === command.id) ? null : extState.currentItem,
      };
    }

    if (command instanceof ItemUpdatedCommand) {
      const extState = state as IExtendedCrudServiceState<T, TId>;

      // currentItem ggf. aktualisieren
      return {
        ...state,
        currentItem: (extState.currentItem && extState.currentItem.id === command.item.id) ?
          command.item : extState.currentItem,
      };
    }


    return state;
  }
}