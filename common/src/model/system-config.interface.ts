import { IFlxEntity } from './flx-entity.interface';

/**
 * Interface für SystemConfig
 */
export interface ISystemConfig extends IFlxEntity<string> {
  /**
   * SystemConfigname
   */
  description: string;

  /**
   * Die Konfiguration im JSON-Format
   */
  json: string;

}