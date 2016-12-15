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
}