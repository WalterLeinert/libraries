import * as process from 'process';

// Logging
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';


const logger = getLogger('fromEnvironment');

/**
 * Liefert den Wert der Environment-Variable @param{variable}, falls gesetzt oder den
 * Wert @param{defaultValue}.
 *
 * @export
 * @param {string} variable
 * @param {string} defaultValue
 * @returns {string}
 */
export function fromEnvironment(variable: string, defaultValue: string): string {

  /* Assert.notNull(variable, 'variable');*/

  let rval = defaultValue;
  try {
    rval = process.env[variable] ? process.env[variable] : defaultValue;
  } catch (err) {
    logger.warn(`fromEnvironment failed: cannot get value from process.env for ${variable} -> used: ${defaultValue}`);
  }

  return rval;
}