import { IFlxEntity } from './flx-entity.interface';

/**
 * Interface für User Rollen
 */
export interface IRole extends IFlxEntity<number> {
  /**
   * Rollenname
   */
  name: string;

  /**
   * Rollenbeschreibung
   */
  description: string;

  /**
   * liefert true, falls die Entity als gelöscht markiert ist
   */
  deleted?: boolean;

  /**
   * Mandanten-Id
   */
  id_client?: number;
}