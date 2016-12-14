import { Service } from 'ts-express-decorators';
import * as Knex from 'knex';

// -------------------------- logging -------------------------------
import { Logger, levels, getLogger } from 'log4js';
import { XLog, using } from 'enter-exit-logger';
// -------------------------- logging -------------------------------


/**
 * Service für den Zugriff auf die Datenbank über Knex
 */
@Service()
export class KnexService {
    static logger = getLogger('KnexService');

    private _knex: Knex;

    constructor() {
        using(new XLog(KnexService.logger, levels.INFO, 'ctor'), (log) => {

            //
            // setup knex
            //
            let knexConfigFile = '../config/knexfile';
            log.info(`reading knex config from ${knexConfigFile} for process.env.NODE_ENV = ${process.env.NODE_ENV}`);

            let config = require(knexConfigFile);
            let knexConfig: Knex.Config = config[process.env.NODE_ENV];

            // logger.info(`read knex config: client = ${knexConfig.client}`)

            this._knex = Knex(knexConfig);

            // TODO: ggf. kein Passwort ausgeben
            log.info('Knex.config = ', knexConfig);
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