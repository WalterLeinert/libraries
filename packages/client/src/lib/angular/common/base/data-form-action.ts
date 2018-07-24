import { Assert } from '@fluxgate/core';

import { IDataFormAction } from './data-form-action.interface';
import { FormAction } from './form-action';

/**
 * Routing-Parameter (data), z.B. für die Aktivierung von AutoformComponent
 */
export class DataFormAction implements IDataFormAction {
  /**
   * die durchzuführende Aktion
   */
  public action: FormAction;

  /**
   * der Key unter dem in data das Objekt liegt, welches durch einen entsprechenden Resolver
   * ermittelt wurde.
   */
  public resolverKey: string;

  /**
   * falls true, wird z.B. auf AutoformComponent eine Buttonleiste angezeigt
   */
  public showButtons?: boolean = false;

  /**
   * falls true, wird z.B. auf AutoformComponent eine New-Button angezeigt
   */
  public showNewButton?: boolean = false;


  public static getData(formAction: IDataFormAction): any {
    Assert.notNull(formAction);
    Assert.notNullOrEmpty(formAction.resolverKey);

    return formAction[formAction.resolverKey];
  }
}