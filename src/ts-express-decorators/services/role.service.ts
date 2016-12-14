import { Service } from 'ts-express-decorators';

// Fluxgate
import { IRole } from '@fluxgate/common';

import { MetadataService } from './metadata.service';
import { BaseService } from './base.service';
import { KnexService } from './knex.service';

@Service()
export class RoleService extends BaseService<IRole, number> {
       static role: Function = undefined;


    /**
     * Registriert die Role-Klasse der Anwendung beim Service.
     * 
     * ACHTUNG: muss vor erster Verwendung des Services aufgerufen werden!
     * 
     * @static
     * @param {Function} role
     * 
     * @memberOf RoleService
     */
    public static registerRole(role: Function) {
        RoleService.role = role;
    }


    constructor(knexSerice: KnexService, metadataService: MetadataService) {
        super(RoleService.role, knexSerice, metadataService);
    }

    // ----------------------------------------------------------------
    // überschriebene Methoden
    // ----------------------------------------------------------------
    public findById(id: number): Promise<IRole> {
        return new Promise<IRole>((resolve, reject) => {
            super.findById(id)
                .then(role => {
                    resolve(role);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public find(): Promise<IRole[]> {
        return new Promise<IRole[]>((resolve, reject) => {
            super.find()
                .then(roles => {
                    resolve(roles);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public update(role: IRole): Promise<IRole> {
        return new Promise<IRole>((resolve, reject) => {
            super.update(role)
                .then(r => {
                    resolve(r);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    public create(role: IRole): Promise<IRole> {
        return new Promise<IRole>((resolve, reject) => {
            super.create(role)
                .then(r => {
                    resolve(r);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    // ----------------------------------------------------------------
    // Ende: überschriebene Methoden
    // ----------------------------------------------------------------
}