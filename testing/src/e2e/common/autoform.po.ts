import { browser, by, element, ElementFinder, promise } from 'protractor';

import { Types } from '@fluxgate/core';


export interface IControlInfo {
  name: string;
  text: string;
}


// TODO: nach fluxgate/libraries verschieben
/**
 * Basisklasse für Autoform-Tests
 *
 * @export
 * @class AutoformPage
 */
export class AutoformPage {
  private infoMap: Map<string, IControlInfo> = new Map<string, IControlInfo>();

  constructor(public infos: IControlInfo[]) {
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
  public getTitle(parentElement?: string): promise.Promise<string> {
    const pe = Types.isNullOrEmpty(parentElement) ? '' : parentElement;
    return element(by.css(`${pe} flx-autoform-dialog span.ui-dialog-title`)).getText();
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
    return element(by.css(
      `flx-autoform-dialog flx-autoform flx-autoform-controls label.control-label[for="${name}"]`)).getText();
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
    return element(by.id(name));
  }


  /**
   * Liefert den New-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getNewButton(): ElementFinder {
    return element(by.id('new'));
  }


  /**
   *
   * Liefert den Delete-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getDeleteButton(): ElementFinder {
    return element(by.id('delete'));
  }


  /**
   * Liefert den Save-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getSaveButton(): ElementFinder {
    return element(by.id('save'));
  }

  /**
   * Liefert den Cancel-Button
   *
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getCancelButton(): ElementFinder {
    return element(by.id('cancel'));
  }

}