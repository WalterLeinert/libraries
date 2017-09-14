import { browser, by, element, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { E2eComponent } from './e2e-component';


/**
 * abstract base class for all page objects
 *
 * @export
 * @abstract
 * @class BasePage
 * @extends {E2eComponent}
 */
export abstract class BasePage extends E2eComponent {

  /**
   * Navigiert auf diese Seite
   *
   * @abstract
   * @memberof BasePage
   */
  public abstract navigateTo();


  public getLink(name: string): ElementFinder {
    return element(by.linkText(`${name}`));
  }

  /**
   * Clickt auf den Link mit Namen @param{name}
   *
   * @param {string} name
   * @returns {promise.Promise<void>}
   * @memberof BasePage
   */
  public clickLink(name: string): promise.Promise<void> {
    return browser.actions().click(this.getLink(name)).perform();
  }


  public get app(): IAppComponent {
    return this.parent as IAppComponent;
  }
}
