import { Service } from 'ts-express-decorators';
import * as Knex from 'knex';


// -------------------------- logging -------------------------------
import { levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------

import { AppRegistryService } from './appRegistry.service';

/**
 * Service für den Zugriff auf die Datenbank über Knex
 */
@Service()
export class KnexService {
    static logger = getLogger('KnexService');

    /**
     * der Key für den Zugriff über @see{AppRegistry}
     */
    public static readonly KNEX_CONFIG_KEY = 'knex-config';

    private _knex: Knex;

    constructor(appRegistryService: AppRegistryService) {
        using(new XLog(KnexService.logger, levels.INFO, 'ctor'), (log) => {
            //
            // setup knex
            //
            let config = appRegistryService.get(KnexService.KNEX_CONFIG_KEY);          
            this._knex = Knex(config);
        });
    }

    /**
     * Liefert die @see{Knex} DB-Fassade
     * 
     * @readonly
     * @type {Knex}
     * @memberOf KnexService
     */
    get knex(): Knex {
        return this._knex;
    }

}