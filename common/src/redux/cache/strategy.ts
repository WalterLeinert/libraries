export type Strategy =

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
  'service';

export class Strategies {
  public static NOP: Strategy = 'nop';
  public static CACHE: Strategy = 'cache';
  public static SERVICE: Strategy = 'service';
}