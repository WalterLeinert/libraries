
/**
 * mögliche Aktionen auf Model-Instanzen 
 */
export type NavigationAction = 'create' | 'update' | 'delete';

/**
 * Interface für Routing-Parameter zur Durchführung von C(R)UD-Aktionen auf Model-Instanzen
 * 
 * @export
 * @interface RouterNavigationAction
 * @template T 
 */
export class IRouterNavigationAction<T> {

  /**
   * 
   * @param action - die geforderte Aktion
   * @param subject - die Model-Instanz
   */
  constructor(public action: NavigationAction, public subject: T) {
  }
}
