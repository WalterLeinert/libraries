
// Fluxgate
import { Constants } from '@fluxgate/core';

export class AutoformConstants {

  /**
   * Das Topic für generische Formulare
   */
  public static readonly GENERIC_TOPIC = 'generic';

  /**
   * Der Topicpfad für generische Formulare
   */
  public static readonly GENERIC_PATH = Constants.PATH_SEPARATOR + 'generic';


  /**
   * Der Pfad-Parameter für generische Entity-Ids;
   */
  public static readonly GENERIC_ENTITY_ID = 'entityId';

  /**
   * Der Pfad-Parameter für generische Entity-Ids;
   */
  public static readonly GENERIC_ENTITY = 'entity';

  public static readonly GENERIC_CONFIG = 'autoformConfig';
}