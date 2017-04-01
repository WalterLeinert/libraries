
/**
 * Interface für Commands.
 * 
 * @export
 * @interface ICommand
 * @template TState
 */
export interface ICommand<TState> {
  /**
   * die Id des zugehörigen Stores
   */
  storeId: string;

  /**
   * Execute-Methode: führt das konkrete Kommando aus mit dem aktuellen State und liefert
   * den neuen State vom Typ @see{TState}
   */
  execute(state: TState): TState;
}
