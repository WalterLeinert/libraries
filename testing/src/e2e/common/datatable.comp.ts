import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { E2eComponent, IE2eComponent } from './e2e-component';

/**
 * Hilfsklasse für das Testen von Datatables (primeNG)
 *
 * Die Klasse geht davon aus, dass ein äusserer Locator bereits den Controlbereich mit der Datatable
 * lokalisiert hat.
 *
 * @export
 */
export class DatatableComponent extends E2eComponent {
  protected static LOCATOR = 'p-datatable > div > div.ui-datatable-tablewrapper > table';


  constructor(parent: IE2eComponent) {
    super(parent, DatatableComponent.LOCATOR);
  }


  /**
   * Liefert die Header-Elemente
   *
   * @returns {ElementArrayFinder}
   * @memberof DatatableComponent
   */
  public getHeaders(): ElementArrayFinder {
    return this.getElement().all(by.css('thead > tr > th'));
  }

  public getRows(): ElementArrayFinder {
    return this.getElement().all(by.css('tbody > tr.ui-widget-content > td > span'));
  }
}
