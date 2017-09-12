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
    return this.getElement().all(this.byCss('thead > tr > th'));
  }

  public getRows(): ElementArrayFinder {
    return this.getElement().all(this.byCss('tbody > tr'));
  }

  /**
   * returns the empty message for row count zero.
   *
   * @returns {promise.Promise<string>}
   * @memberof DatatableComponent
   */
  public getEmptyMessage(): promise.Promise<string> {
    return this.getElement().element(this.byCss('tbody > tr > td.ui-datatable-emptymessage')).getText();
  }


  /**
   * returns the table row at given @param{index}.
   * Hint: index is zero-based, maps to css-index one-based.
   *
   * @param index
   */
  public getRow(index: number): ElementFinder {
    return this.getElement().element(this.byCss(`tbody > tr:nth-child(${index + 1})`));
  }

  /**
   * returns all table columns for @param{row}
   *
   * @param {number} row
   * @returns {ElementArrayFinder}
   * @memberof DatatableComponent
   */
  public getColumns(row: number): ElementArrayFinder {
    return this.getRow(row).all(this.byCss(`td`));
  }

  /**
   * returns the table column at @param{index} for given row at @param{row}.
   * Hint: index is zero-based, maps to css-index one-based.
   *
   * @param {number} row
   * @param {number} index
   * @returns {ElementFinder}
   * @memberof DatatableComponent
   */
  public getColumn(row: number, index: number): ElementFinder {
    return this.getRow(row).element(this.byCss(`td:nth-child(${index + 1})`));
  }

}
