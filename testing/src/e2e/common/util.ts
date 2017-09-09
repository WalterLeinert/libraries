// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------'

const logger = getLogger('testing-logger');

/**
 * erzeugt ein console.log mit 6 Spaces Einrückung -> sieht im Protractor-Report besser aus
 *
 * @export
 * @param {string} message
 */
export function log(message: string) {
  // tslint:disable-next-line:no-console
  logger.info('      ' + message);
}