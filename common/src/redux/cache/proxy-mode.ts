export type ProxyMode =

  /**
   * Servicecalls werden direkt an den Service weitergeleitet
   */
  'nop' |

  /**
   * Servicecalls gehen an den Cache
   */
  'cache' |

  /**
   * Servicecalls werden über EntityVersionProxy optimiert
   */
  'entityVersion';

export class ProxyModes {
  public static NOP: ProxyMode = 'nop';
  public static CACHE: ProxyMode = 'cache';
  public static ENTITY_VERSION: ProxyMode = 'entityVersion';
}