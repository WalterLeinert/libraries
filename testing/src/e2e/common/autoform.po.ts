import { browser, by, element, ElementFinder, promise } from 'protractor';

import { ColumnMetadata, MetadataStorage, TableMetadata } from '@fluxgate/common';
import { Assert, Funktion, Types } from '@fluxgate/core';


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

  private nameSet: Set<string> = new Set<string>();
  private metadataMap: Map<string, ColumnMetadata> = new Map<string, ColumnMetadata>();
  private tableMetadata: TableMetadata;
  private infoMap: Map<string, IControlInfo> = new Map<string, IControlInfo>();


  constructor(parent: IE2eComponent, private isDialog: boolean,
    public names: string[] | IControlInfo[], private _model?: Funktion | string) {
    super(parent, isDialog ? AutoformPage.DIALOG_LOCATOR : AutoformPage.LOCATOR);


    if (names.length > 0) {
      if (typeof names[0] === 'string') {
        this.tableMetadata = MetadataStorage.instance.findTableMetadata(this._model);
        Assert.notNull(this.tableMetadata);

        (names as string[]).forEach((name) => {
          const colMetadata = this.tableMetadata.getColumnMetadataByProperty(name);
          Assert.notNull(colMetadata, `${this.tableMetadata.className} has no property ${name}`);
          this.metadataMap.set(name, colMetadata);
          this.nameSet.add(name);
        });
      } else {
        (names as IControlInfo[]).forEach((info) => {
          this.infoMap.set(info.name, info);
          this.nameSet.add(info.name);
        });
      }
    }
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
    if (!this.nameSet.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.getElement().element(this.byCss(
      `flx-autoform-controls label.control-label[for="${name}"]`)).getText();
  }


  public getDisplayName(name: string): string {
    if (!this.nameSet.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.metadataMap.get(name).options.displayName;
  }


  /**
   * Liefert das Input-Control für das Modelattribut mit Namen @param{name}.
   *
   * @param {string} name
   * @returns {ElementFinder}
   * @memberof AutoformPage
   */
  public getElementById(name: string): ElementFinder {
    if (!this.nameSet.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.getElement().element(by.id(name));
  }

  public getElementValue(name: string): promise.Promise<string> {
    return this.getElementById(name).getAttribute('ng-reflect-model');
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