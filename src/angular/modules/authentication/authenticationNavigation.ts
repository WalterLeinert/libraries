import { OpaqueToken } from '@angular/core';

/**
 * Token für Zugriff auf das Interface @see{IAuthenticationNavigation}
 * mit Redirect-Urls nach Authentifizierungsaktionen
 */
export const AuthenticationNavigation = new OpaqueToken('Authentication.Navigation');