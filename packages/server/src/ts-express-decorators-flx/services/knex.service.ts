import * as Knex from 'knex';
import { Service } from 'ts-express-decorators';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


import { ErrorAdapter } from '../database/error-adapter';
import { ErrorAdapterFactory } from '../database/error-adapter-factory';

/**
 * Service für den Zugriff auf die Datenbank über Knex
 */
@Service()
export class KnexService {
  protected static logger = getLogger(KnexService);
  private static _knex: Knex;
  private static _errorAdapter: ErrorAdapter;

  public static configure(knexConfig: Knex.Config) {
    KnexService._knex = Knex(knexConfig);

    KnexService._errorAdapter = ErrorAdapterFactory.instance.createAdapter(knexConfig.client);
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


  /**
   * Liefert den konkreten ErrorAdapter für den konfigurierten DB-Client
   */
  get errorAdapter(): ErrorAdapter {
    return KnexService._errorAdapter;
  }

}