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