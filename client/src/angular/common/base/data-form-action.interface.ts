import { Funktion } from '@fluxgate/core';

import { FormAction } from './form-action';


/**
 * Routing-Parameter (data), z.B. für die Aktivierung von AutoformComponent
 *
 * @export
 * @interface IDataFormAction
 */
export interface IDataFormAction {
  /**
   * die durchzuführende Aktion
   */
  action: FormAction;

  /**
   * der Key unter dem in data das Objekt liegt, welches durch einen entsprechenden Resolver
   * ermittelt wurde.
   */
  resolverKey: string;

  /**
   * falls true, wird z.B. auf AutoformComponent eine Buttonleiste angezeigt
   *
   * @type {boolean}
   * @memberof IDataFormAction
   */
  showButtons?: boolean;
}