import { IFlxStatusEntity } from './flx-status-entity.interface';

/**
 * Interface für User Rollen
 */
export interface IRole extends IFlxStatusEntity<number> {
  /**
   * Rollenname
   */
  name: string;

  /**
   * Rollenbeschreibung
   */
  description: string;

}