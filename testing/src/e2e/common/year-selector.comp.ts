import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { DropdownSelectorComponent } from './dropdown-selector.comp';
import { E2eComponent, IE2eComponent } from './e2e-component';


/**
 * helper class for e2e tests of FlxMonthSelector
 *
 * @export
 */
export class YearSelectorComponent extends DropdownSelectorComponent {
  protected static readonly logger = getLogger(YearSelectorComponent);

  protected static readonly LOCATOR = 'flx-year-selector';

  constructor(parent: IE2eComponent) {
    super(parent, YearSelectorComponent.LOCATOR);
  }
}