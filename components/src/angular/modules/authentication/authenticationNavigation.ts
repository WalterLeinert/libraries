import { OpaqueToken } from '@angular/core';

/**
 * Token für Zugriff auf das Interface @see{AuthenticationNavigation}
 * mit Redirect-Urls nach Authentifizierungsaktionen
 */
export const AuthenticationNavigationToken = new OpaqueToken('Authentication.Navigation');

/**
 * Klasse für Redirect-Urls nach Authentifizierungsaktionen
 *
 * @export
 * @interface AuthenticationNavigation
 */
export class AuthenticationNavigation {
  public loginRedirectUrl: string;
  public registerRedirectUrl?: string;
  public logoutRedirectUrl: string;
  public changeUserRedirectUrl: string;
}