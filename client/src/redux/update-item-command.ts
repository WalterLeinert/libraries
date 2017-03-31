import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';


export class UpdateItemCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private item: T) {
    super(storeId);
  }

  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return { ...state, item: this.item };
  }
}
