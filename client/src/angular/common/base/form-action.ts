
/**
 * die bei @see{AutoformComponent) möglichen Aktionen
 */
export type FormAction =

  /**
   * Neue Modelinstanz anlegen
   */
  'create' |

  /**
   * existierende Modellinstanz ändern
   */
  'update' |

  /**
   * existierende Modellinstanz darstellen (readonly)
   */
  'view';

export class FormActions {
  public static CREATE: FormAction = 'create';
  public static UPDATE: FormAction = 'update';
  public static VIEW: FormAction = 'view';
}

/**
 * Routing-Parameter (data), z.B. für die Aktivierung von AutoformComponent
 *
 * @export
 * @interface IDataFormAction
 */
export interface IDataFormAction {
  /**
   * die durchzuführende Aktion
   */
  action: FormAction;

  /**
   * der Key unter dem in data das Objekt liegt, welches durch einen entsprechenden Resolver
   * ermittelt wurde.
   */
  resolverKey: string;

  /**
   * falls true, wird z.B. auf AutoformComponent eine Buttonleiste angezeigt
   *
   * @type {boolean}
   * @memberof IDataFormAction
   */
  showButtons?: boolean;
}