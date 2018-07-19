import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Assert, IListAdapter } from '@fluxgate/core';

import { IDropdownAdapter, IDropdownAdapterOptions } from '.';

/**
 * Abstrakte Basisklasse für die Anbindung von DropDown-Controls
 */
export abstract class DropdownAdapter<T> implements IDropdownAdapter {
  /**
   * symbolischer Propertyname: bezieht sich auf das aktuelle Item:
   * - bei Primitiven (wie string[]) auf den einzelnen Wert der Liste
   * - bei Objekten (wie Person[]) auf die einzelne Objektinstanz
   */
  public static CURRENT_ITEM = '.';

  /**
   * Defaultoptionen
   */
  public static DEFAULT_ADAPTER_OPIONS: IDropdownAdapterOptions = {
    textField: DropdownAdapter.CURRENT_ITEM,
    valueField: DropdownAdapter.CURRENT_ITEM,
    allowNoSelection: true,
    allowNoSelectionText: '(Auswahl)'
  };

  public abstract data: any[];

  private _adapterOptions?: IDropdownAdapterOptions;


  /**
   * @param{IListAdapter<T>} listAdapter - der zugehörige Listadapter
   */
  protected constructor(private listAdapter: IListAdapter<T>, adapterOptions?: IDropdownAdapterOptions) {
    Assert.notNull(listAdapter);

    // TODO: ggf. DropDownAdapter.DEFAULT_ADAPTER_OPIONS klonen!

    if (!adapterOptions) {
      this._adapterOptions = DropdownAdapter.DEFAULT_ADAPTER_OPIONS;
    } else {
      this._adapterOptions = adapterOptions;
      if (!this._adapterOptions.textField) {
        this._adapterOptions.textField = DropdownAdapter.DEFAULT_ADAPTER_OPIONS.textField;
      }
      if (!this._adapterOptions.valueField) {
        this._adapterOptions.valueField = DropdownAdapter.DEFAULT_ADAPTER_OPIONS.valueField;
      }

      if (!this._adapterOptions.allowNoSelection) {
        this._adapterOptions.allowNoSelection = DropdownAdapter.DEFAULT_ADAPTER_OPIONS.allowNoSelection;
      }
      if (!this._adapterOptions.allowNoSelectionText) {
        this._adapterOptions.allowNoSelectionText = DropdownAdapter.DEFAULT_ADAPTER_OPIONS.allowNoSelectionText;
      }
    }

  }


  /**
   * Liefert den Wert der angebundenen Werteliste für den Index @param{index}.
   */
  public getValueAt(index: number): Observable<T> {
    return this.getItems()
      .pipe(map((items) => items[index]));
  }



  /**
   * Liefert die Liste der anzubindenden Werte
   */
  protected getItems(): Observable<T[]> {
    return this.listAdapter.getItems();
  }


  /**
   * Liefert den Anzeigetext für das Item @param{item}
   */
  protected getText(item: T): string {
    let text: string;

    if (this._adapterOptions.textField === DropdownAdapter.CURRENT_ITEM) {
      text = item.toString();
    } else {
      text = item[this._adapterOptions.textField];
    }

    return text;
  }

  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   */
  protected getValue(item: T): any {
    let value: any;

    if (this._adapterOptions.valueField === DropdownAdapter.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this._adapterOptions.valueField];
    }

    return value;
  }

  protected get adapterOptions(): IDropdownAdapterOptions {
    return this._adapterOptions;
  }

}
