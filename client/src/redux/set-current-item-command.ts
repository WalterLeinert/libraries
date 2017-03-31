import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';

export class SetCurrentItemCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
    super(storeId);
  }

  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    const item: T = this.item;
    return { ...state, currentItem: item };
  }
}