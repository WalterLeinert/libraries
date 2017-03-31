import { ServiceCommand } from './service-command';
import { IServiceState } from './service-state.interface';


export class DeleteItemCommand<T, TId> extends ServiceCommand<T, TId> {

  constructor(storeId: string, private id: TId) {
    super(storeId);
  }

  public execute(state: IServiceState<T, TId>): IServiceState<T, TId> {
    return { ...state, deletedId: this.id };
  }
}
