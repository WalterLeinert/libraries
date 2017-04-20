export type ServiceRequestState =
  /**
   * nicht definierter Zustand
   */
  'undefined' |

  /**
   * async Request wurde gestartet
   */
  'running' |

  /**
   * async Request wurde erfolgreich beendet
   */
  'done' |

  /**
   * async Request wurde mit Fehler beendet
   */
  'error';

export class ServiceRequestStates {
  public static UNDEFINED: ServiceRequestState = 'undefined';
  public static RUNNING: ServiceRequestState = 'running';
  public static DONE: ServiceRequestState = 'done';
  public static ERROR: ServiceRequestState = 'error';
}