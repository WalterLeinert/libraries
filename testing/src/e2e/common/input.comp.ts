import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of inputs
 *
 * @export
 */
export class InputComponent extends E2eComponent {

  constructor(parent: IE2eComponent, css: string) {
    super(parent, css);
  }


  public getText(): promise.Promise<string> {
    return this.getElement().getAttribute('ng-reflect-model');
  }
}