import { IFlxEntity } from './flx-entity.interface';

/**
 * Interface für SystemConfig
 */
export interface ISystemConfig extends IFlxEntity<number> {
  /**
   * SystemConfigname
   */
  name: string;

  /**
   * Die Konfiguration im JSON-Format
   */
  json: string;

}