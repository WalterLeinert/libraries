import { browser, by, element, ElementFinder, promise } from 'protractor';

export abstract class BasePage {

  /**
   * Navigiert auf diese Seite
   *
   * @abstract
   * @memberof BasePage
   */
  public abstract navigateTo();


  /**
   * Liefert den aktiven Tab
   *
   * @returns {ElementFinder}
   * @memberof BasePage
   */
  public abstract getActiveTab(): ElementFinder;


  /**
   * Liefert den Titel des aktiven Tabs
   *
   * @returns {promise.Promise<string>}
   * @memberof BasePage
   */
  public getTabTitle(): promise.Promise<string> {
    return this.getActiveTab().getText();
  }

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
}
