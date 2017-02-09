import * as Knex from 'knex';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
import {
    configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { AppRegistryService } from './appRegistry.service';

/**
 * Service für den Zugriff auf die Datenbank über Knex
 */
@Service()
export class KnexService {
    protected static logger = getLogger('KnexService');

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
            const config = appRegistryService.get(KnexService.KNEX_CONFIG_KEY);
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