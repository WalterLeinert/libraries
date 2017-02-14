// Angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


// PrimeNG
import { SelectItem } from 'primeng/primeng';

// Fluxgate
import { Assert, Clone, ColumnMetadata, StringUtil, TableMetadata } from '@fluxgate/common';

// -------------------------- logging -------------------------------
import {
  configure, getLogger, ILogger, levels, Logger, using, XLog
} from '@fluxgate/common';
// -------------------------- logging -------------------------------

import { DataTypes, DisplayInfo, IDisplayInfo, } from '../../../base';
import { MetadataService, ProxyService } from '../../services';
import { IService } from '../../services/service.interface';

/**
 * Fluxgate EnumValue-Komponente
 *
 * Erlaubt die Anzeige eines ausgewählten Enum-Werts,
 *
 * @export
 * @class DropdownSelectorComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'flx-enum-value',
  template: `
<span *ngIf="item">
{{ getText(item) }}
</span>
`,
  styles: []
})
export class EnumValueComponent implements OnInit, OnDestroy {
  protected static logger = getLogger(EnumValueComponent);

  private _dataService: IService;


  /**
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   *
   * @type {string}
   * @memberOf EnumValueComponent
   */
  @Input() public textField: string;

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'selectedValue' übernommen werden soll.
   *
   * @type {string}
   * @memberOf EnumValueComponent
   */
  @Input() public valueField: string;

  /**
   * diese Property steuert, welches Enum-Item angezeigt werden soll. Der Werte 
   * wird über @see{valueField} bestimmt.
   *
   * @type {string}
   * @memberOf EnumValueComponent
   */
  @Input() public itemSelector: any;


  /**
   * itemChange Event: wird bei jeder Wertänderung gefeuert.
   *
   * Eventdaten: @type{any} - Wert.
   *
   */
  @Output() public itemChange = new EventEmitter<any>();


  /**
   * das @see{itemSelector} entsprechende Item.
   *
   * @type {any}
   */
  private _item: any;


  public ngOnInit() {
    if (this.dataService) {
      this.dataService.find().subscribe((items: any[]) => {
        const filteredItems = items.filter((item) => this.getValue(item) === this.itemSelector);
        if (filteredItems.length === 1) {
          this.item = filteredItems[0];
        }
      });
    }

  }


  public ngOnDestroy() {
    // ok
  }



  // -------------------------------------------------------------------------------------
  // Property dataService
  // -------------------------------------------------------------------------------------
  public get dataService(): IService {
    return this._dataService;
  }

  @Input() public set dataService(value: IService) {
    if (this._dataService !== value) {
      this._dataService = value;
    }
  }


  // -------------------------------------------------------------------------------------
  // Property item und der Change Event
  // -------------------------------------------------------------------------------------

  protected onItemChange(value: any) {
    using(new XLog(EnumValueComponent.logger, levels.INFO, 'onItemChange'), (log) => {
      if (log.isInfoEnabled()) {
        log.log(`value = ${JSON.stringify(value)}`);
      }
      this.itemChange.emit(value);
    });
  }

  public get item(): any {
    return this._item;
  }

  @Input() public set item(value: any) {
    if (this._item !== value) {
      this._item = value;
      this.onItemChange(value);
    }
  }



  /**
   * Liefert den Anzeigetext für das Item @param{item}
   */
  protected getText(item: any): string {
    let text: string;

    if (this.textField === DisplayInfo.CURRENT_ITEM) {
      text = item.toString();
    } else {
      text = item[this.textField];
    }

    return text;
  }

  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   * Konfiguration muss berücksichtigt werden.
   */
  protected getValue(item: any): any {
    let value: any;

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this.valueField];
    }

    return value;
  }

}