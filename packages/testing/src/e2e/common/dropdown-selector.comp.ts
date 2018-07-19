import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Types } from '@fluxgate/core';

import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of flx-dropdown-selector
 *
 * @export
 */
export class DropdownSelectorComponent extends E2eComponent {
  protected static readonly logger = getLogger(DropdownSelectorComponent);

  protected static LOCATOR = 'flx-dropdown-selector p-dropdown';


  constructor(parent: IE2eComponent, css: string = '') {
    super(parent, Types.isNullOrEmpty(css) ?
      DropdownSelectorComponent.LOCATOR : css + ' ' + DropdownSelectorComponent.LOCATOR);
  }


  // Liefert das Dropdown caret zum Ausklappen
  public getDropdownCaret(): ElementFinder {
    return using(new XLog(DropdownSelectorComponent.logger, levels.INFO, 'getDropdownCaret'), (log) => {
      return this.getElement().element(this.byCss(
        'div div.ui-dropdown-trigger.ui-state-default.ui-corner-right span'));
    });
  }


  // Liefert die Monatsliste nach dem Ausklappen
  public getDropdownList(): ElementArrayFinder {
    return using(new XLog(DropdownSelectorComponent.logger, levels.INFO, 'getDropdownList'), (log) => {
      return this.getElement().all(this.byCss(
        'div.ui-dropdown-panel.ui-widget-content.ui-corner-all.ui-helper-hidden.ui-shadow div ul li span'));
    });
  }

  public openDropdown(): promise.Promise<void> {
    return using(new XLog(DropdownSelectorComponent.logger, levels.INFO, 'openDropdown'), (log) => {
      return browser.actions()
        .click(this.getDropdownCaret())
        .perform();
    });
  }

  public clickItem(index: number): promise.Promise<void> {
    return using(new XLog(DropdownSelectorComponent.logger, levels.INFO, 'clickItem', `index = ${index}`), (log) => {
      return browser.actions()
        .click(this.getDropdownList().get(index))
        .perform();
    });
  }
}