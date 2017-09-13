import { browser, by, element, ElementFinder, promise } from 'protractor';
import { By } from 'selenium-webdriver';

import { Types } from '@fluxgate/core';

import { BasePage, E2eComponent, IAppComponent, IE2eComponent } from '.';


/**
 * Basisklasse für alle Pages (vor und nach Login)
 *
 * @export
 * @abstract
 * @class StartPage
 * @extends {BasePage}
 */
export abstract class StartPage extends BasePage {

  protected constructor(app: IAppComponent, css: string) {
    super(app, css);
  }


  public getActiveTab(): ElementFinder {
    throw new Error('not supported');
  }

}