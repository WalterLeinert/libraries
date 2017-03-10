
/**
 * mögliche Aktionen auf Model-Instanzen 
 */
export type NavigationAction =
  /**
   * Erzeugen einer neuen Modelinstanz
   */
  'create' |

  /**
   * Update auf eine Modelinstanz
   */
  'update' |

  /**
   * Löschen einer Modelinstanz
   */
  'delete' |

  /**
   * Selektion des Items (kein Servicecall)
   */
  'select';


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
