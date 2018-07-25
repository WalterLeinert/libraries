import { InjectionToken } from '@angular/core';

/**
 * Token für Zugriff auf das Interface @see{AuthenticationNavigation}
 * mit Redirect-Urls nach Authentifizierungsaktionen
 */
// tslint:disable-next-line:variable-name
export const AuthenticationNavigationToken = new InjectionToken<AuthenticationNavigation>('Authentication.Navigation');

/**
 * Klasse für Redirect-Urls nach Authentifizierungsaktionen
 */
export class AuthenticationNavigation {
  public loginRedirectUrl: string;
  public registerRedirectUrl?: string;
  public logoutRedirectUrl?: string;
  public changePasswordRedirectUrl?: string;
}