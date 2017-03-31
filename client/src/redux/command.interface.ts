export interface ICommand<TState> {
  storeId: string;
  execute(state: TState): TState;
}
