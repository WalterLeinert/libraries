import { browser, by, element, ElementFinder, promise } from 'protractor';

import { IAppComponent } from './app.comp.interface';
import { E2eComponent } from './e2e-component';


/**
 * e2e test helper class for modeling the root component of the app.
 *
 * @export
 * @class AppComponent
 * @extends {E2eComponent}
 */
export class AppComponent extends E2eComponent implements IAppComponent {

  constructor(css: string, private _titleCss: string) {
    super(null, css);
  }

  public getAppTitle(): promise.Promise<string> {
    return this.getElement().element(this.byCss(this._titleCss)).getText();
  }
}
