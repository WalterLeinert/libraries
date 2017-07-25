import { IFlxEntity } from './flx-entity.interface';

/**
 * Interface für SystemConfig
 */
export interface ISystemConfig extends IFlxEntity<string> {

  /**
   * Der Typ der Konfiguration (z.B. 'smtp')
   */
  type: string;

  /**
   * Beschreibung der Konfiguration
   */
  description: string;

  /**
   * Die konkrete Konfiguration serialisiert im JSON-Format
   */
  json: string;

}