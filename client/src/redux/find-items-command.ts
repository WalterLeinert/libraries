import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';


export class FindItemsCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private items: T[]) {
    super(storeId);
  }

  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return { ...state, items: this.items };
  }
}