import * as Knex from 'knex';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


/**
 * Service für den Zugriff auf die Datenbank über Knex
 */
@Service()
export class KnexService {
  protected static logger = getLogger(KnexService);
  private static _knex: Knex;

  public static configure(knexConfig: Knex.Config) {
    KnexService._knex = Knex(knexConfig);
  }

  /**
   * Liefert die @see{Knex} DB-Fassade
   *
   * @readonly
   * @type {Knex}
   * @memberOf KnexService
   */
  get knex(): Knex {
    return KnexService._knex;
  }

}