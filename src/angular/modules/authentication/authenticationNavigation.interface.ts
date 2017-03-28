/**
 * Interface für Redirect-Urls nach Authentifizierungsaktionen
 * 
 * @export
 * @interface IAuthenticationNavigation
 */
export interface IAuthenticationNavigation {
  loginRedirectUrl: string;
  registerRedirectUrl?: string;
  logoutRedirectUrl: string;
  changeUserRedirectUrl: string;
}