import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of FlxMonthSelector
 *
 * @export
 */
export class MonthSelectorComponent extends E2eComponent {
  protected static readonly logger = getLogger(MonthSelectorComponent);

  protected static readonly LOCATOR = 'flx-month-selector';

  constructor(parent: IE2eComponent) {
    super(parent, MonthSelectorComponent.LOCATOR);
  }


  // Liefert das Dropdown caret zum Ausklappen
  public getDropdownCaret(): ElementFinder {
    return using(new XLog(MonthSelectorComponent.logger, levels.INFO, 'getDropdownCaret'), (log) => {
      return this.getElement().element(this.byCss(
        'flx-dropdown-selector p-dropdown div.ui-dropdown-trigger.ui-state-default.ui-corner-right  span'));
    });
  }


  // Liefert die Monatsliste nach dem Ausklappen
  public getDropdownList(): ElementArrayFinder {
    return using(new XLog(MonthSelectorComponent.logger, levels.INFO, 'getDropdownList'), (log) => {
      return this.getElement().all(this.byCss(
        'flx-dropdown-selector p-dropdown' +
        ' div.ui-dropdown-panel.ui-widget-content.ui-corner-all.ui-helper-hidden.ui-shadow div ul li span'));
    });
  }

  public openDropdown(): promise.Promise<void> {
    return using(new XLog(MonthSelectorComponent.logger, levels.INFO, 'openDropdown'), (log) => {
      return browser.actions()
        .click(this.getDropdownCaret())
        .perform();
    });
  }

  public clickMonth(index: number): promise.Promise<void> {
    return using(new XLog(MonthSelectorComponent.logger, levels.INFO, 'clickMonth', `index = ${index}`), (log) => {
      return browser.actions()
        .click(this.getDropdownList().get(index))
        .perform();
    });
  }
}