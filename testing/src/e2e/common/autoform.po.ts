import { browser, by, element, ElementFinder, promise } from 'protractor';

import { Types } from '@fluxgate/core';


import { E2eComponent, IE2eComponent } from './e2e-component';


export interface IControlInfo {
  name: string;
  text: string;
}


/**
 * Basisklasse für Autoform-Tests
 *
 * @export
 * @class AutoformPage
 */
export class AutoformPage extends E2eComponent {
  protected static DIALOG_LOCATOR = 'flx-autoform-dialog';
  protected static LOCATOR = 'flx-autoform';

  private infoMap: Map<string, IControlInfo> = new Map<string, IControlInfo>();


  constructor(parent: IE2eComponent, private isDialog: boolean, public infos: IControlInfo[]) {
    super(parent, isDialog ? AutoformPage.DIALOG_LOCATOR : AutoformPage.LOCATOR);

    infos.forEach((info) => {
      this.infoMap.set(info.name, info);
    });
  }


  /**
   * Liefert den Titel
   *
   * @param {string} parentElement
   * @returns {promise.Promise<string>}
   * @memberof AutoformPage
   */
  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss(`span.ui-dialog-title`)).getText();
  }

  /**
   * Liefert den Labeltext für das Modelattribut mit Namen @param{name}.
   *
   * @param {string} name
   * @returns {promise.Promise<string>}
   * @memberof AutoformPage
   */
  public getLabelText(name: string): promise.Promise<string> {
    if (!this.infoMap.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.getElement().element(this.byCss(
      `flx-autoform-controls label.control-label[for="${name}"]`)).getText();
  }

  /**
   * Liefert das Input-Control für das Modelattribut mit Namen @param{name}.
   *
   * @param {string} name
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getInput(name: string): ElementFinder {
    if (!this.infoMap.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.getElement().element(by.id(name));
  }


  /**
   * Liefert den New-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getNewButton(): ElementFinder {
    return this.getElement().element(by.id('new'));
  }


  /**
   *
   * Liefert den Delete-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getDeleteButton(): ElementFinder {
    return this.getElement().element(by.id('delete'));
  }


  /**
   * Liefert den Save-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getSaveButton(): ElementFinder {
    return this.getElement().element(by.id('save'));
  }

  /**
   * Liefert den Cancel-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getCancelButton(): ElementFinder {
    return this.getElement().element(by.id('cancel'));
  }

}