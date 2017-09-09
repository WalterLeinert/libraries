
/**
 * erzeugt ein console.log mit 6 Spaces Einrückung -> sieht im Protractor-Report besser aus
 *
 * @export
 * @param {string} message
 */
export function log(message: string) {
    // tslint:disable-next-line:no-console
    console.log('      ' + message);
}