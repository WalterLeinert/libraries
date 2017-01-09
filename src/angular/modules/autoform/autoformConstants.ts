
// Fluxgate
import {Constants } from '@fluxgate/common'

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
  public static readonly GENERIC_ID = 'autoform-id';

}