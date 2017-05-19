import { Serializable } from '@fluxgate/core';

/**
 * Hilfsklasse zum Übertragen eines REST-Requests für das Ändern des Passworts.
 *
 * @export
 * @class PasswordChange
 */
@Serializable()
export class PasswordChange {

  constructor(public username: string, public password: string, public passwordNew: string) {
  }
}