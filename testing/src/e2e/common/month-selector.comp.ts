import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of FlxMonthSelector
 *
 * @export
 */
export class MonthSelectorComponent extends E2eComponent {
  protected static readonly LOCATOR = 'flx-month-selector';

  constructor(parent: IE2eComponent) {
    super(parent, MonthSelectorComponent.LOCATOR);
  }


  // Liefert das Dropdown caret zum Ausklappen
  public getDropdownCaret(): ElementArrayFinder {
    return this.getElement().all(by.css(MonthSelectorComponent.LOCATOR +
      'flx-dropdown-selector p-dropdown div.ui-dropdown-trigger.ui-state-default.ui-corner-right  span'));
  }


  // Liefert die Monatsliste nach dem Ausklappen
  public getDropdownList(): ElementArrayFinder {
    return this.getElement().all(by.css(
      'flx-dropdown-selector p-dropdown' +
      ' div.ui-dropdown-panel.ui-widget-content.ui-corner-all.ui-helper-hidden.ui-shadow div ul li span'));
  }

  public clickMonth(index: number): promise.Promise<void> {
    return browser.actions()
      .click(this.getDropdownCaret())
      .click(this.getDropdownList().get(index))
      .perform();
  }
}