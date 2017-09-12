import { browser, by, element, ElementFinder, promise } from 'protractor';
import { E2eComponent, IE2eComponent } from './e2e-component';

/**
 * e2e test helper class for modeling the root component of the app.
 *
 * @export
 * @class AppComponent
 * @extends {E2eComponent}
 */
export class AppComponent extends E2eComponent {

  constructor(css: string = 'app-root') {
    super(null, css);
  }
}
