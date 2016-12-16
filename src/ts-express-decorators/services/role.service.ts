import { Service } from 'ts-express-decorators';

// -------------------------- logging -------------------------------
import { Logger, levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

// Fluxgate
import { Role, IRole, AppRegistry } from '@fluxgate/common';

import { MetadataService } from './metadata.service';
import { BaseService } from './base.service';
import { KnexService } from './knex.service';

@Service()
export class RoleService extends BaseService<IRole, number> {

    constructor(knexSerice: KnexService, metadataService: MetadataService) {
        super(AppRegistry.instance.get<Function>(Role.ROLE_CONFIG_KEY), knexSerice, metadataService);
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