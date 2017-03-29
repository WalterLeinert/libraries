import { IEntity } from './entity.interface';

/**
 * Interface für User Rollen 
 */
export interface IRole extends IEntity {
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
  id_mandant?: number;
}