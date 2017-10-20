import { browser, by, element, promise } from 'protractor';

export class AppPage {
  public navigateTo() {
    return browser.get('/');
  }

  public getParagraphText(): promise.Promise<string> {
    return element(by.css('flx-root h1')).getText();
  }
}
