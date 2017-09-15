import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { E2eComponent, IE2eComponent } from './e2e-component';
import { ElementHelper } from './element-helper';


/**
 * helper class for e2e tests of flx-sidebar
 *
 * @export
 */
export class SidebarComponent extends E2eComponent {
  protected static readonly LOCATOR = 'flx-sidebar';

  public static readonly PINNED_CLASSES = ['fa', 'fa-thumb-tack', 'fa-lg'];
  public static readonly UNPINNED_CLASSES = SidebarComponent.PINNED_CLASSES.concat('fa-rotate-90');


  constructor(parent: IE2eComponent) {
    super(parent, SidebarComponent.LOCATOR);
  }


  public getToggleSidebar(): ElementFinder {
    return this.getElement().element(this.byCss('a[title="toggle sidebar"]'));
  }

  public getPinIcon(): ElementFinder {
    return this.getElement().element(this.byCss('a[title="toggle sidebar pin"] i'));
  }

  public isIconUnpinned(debug: boolean = false): promise.Promise<boolean> {
    return ElementHelper.hasClasses(this.getPinIcon(), SidebarComponent.UNPINNED_CLASSES, debug);
  }

  public isIconPinned(debug: boolean = false): promise.Promise<boolean> {
    return ElementHelper.hasClasses(this.getPinIcon(), SidebarComponent.PINNED_CLASSES, debug);
  }

}