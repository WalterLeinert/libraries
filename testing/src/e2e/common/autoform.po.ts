import { browser, by, element, ElementFinder, promise } from 'protractor';

import { ColumnMetadata, MetadataStorage, TableMetadata } from '@fluxgate/common';
import { Assert, Funktion, Types } from '@fluxgate/core';


import { AutoformComponent } from './autoform.comp';
import { IControlInfo } from './control-info.interface';
import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of flx-autoform-dialog
 */
export class AutoformPage extends E2eComponent {
  protected static LOCATOR = 'flx-autoform-dialog';

  private _autoform: AutoformComponent;


  constructor(parent: IE2eComponent, names: string[] | IControlInfo[], model?: Funktion | string) {
    super(parent, AutoformPage.LOCATOR);

    this._autoform = new AutoformComponent(this, names, model);
  }

  public async expectElements() {
    this._autoform.expectElements();
  }


  /**
   * Liefert den Titel
   *
   * @returns {promise.Promise<string>}
   * @memberof AutoformPage
   */
  public getTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss(`span.ui-dialog-title`)).getText();
  }


  public get autoform(): AutoformComponent {
    return this._autoform;
  }
}