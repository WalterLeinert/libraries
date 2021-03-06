// Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


// Fluxgate
import { CoreComponent, DisplayInfo, MessageService } from '@fluxgate/client';
import { EntityStatus, FilterBehaviour, ICrudServiceRequests, IEntity, StatusFilter } from '@fluxgate/common';
import { Core } from '@fluxgate/core';


/**
 * Fluxgate EnumValue-Komponente
 *
 * Erlaubt die Anzeige eines ausgewählten Enum-Werts,
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
export class EnumValueComponent extends CoreComponent {
  protected static logger = getLogger(EnumValueComponent);

  /**
   * die ServiceRequests zum Bereitstellen der Daten
   *
   * Hinweis: data und dataServiceRequests dürfen nicht gleichzeitig gesetzt sein!
   */
  private _dataServiceRequests: ICrudServiceRequests<IEntity<any>, any>;


  /**
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   */
  @Input() public textField: string;

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'value' übernommen werden soll.
   */
  @Input() public valueField: string;

  /**
   * diese Property steuert, welches Enum-Item angezeigt werden soll. Der Werte
   * wird über @see{valueField} bestimmt.
   */
  private _itemSelector: any;
  @Output() public itemSelectorChange = new EventEmitter<any>();


  /**
   * itemChange Event: wird bei jeder Wertänderung gefeuert.
   *
   * Eventdaten: Wert.
   *
   */
  @Output() public itemChange = new EventEmitter<any>();

  private items: any[];


  /**
   * das @see{itemSelector} entsprechende Item.
   */
  private _item: any;

  constructor(messageService: MessageService) {
    super(messageService);
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();

    if (this.dataServiceRequests) {

      // deleted Items auch anzeigen
      this.registerSubscription(this.dataServiceRequests.find(
        new StatusFilter(FilterBehaviour.Add, EntityStatus.Deleted))
        .subscribe((items: any[]) => {
          this.items = items;

          this.updateItem();
        }));
    }
  }


  /**
   * Liefert den Anzeigetext für das Item @param{item}
   */
  public getText(item: any): string {
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
  public getValue(item: any): any {
    let value: any;

    if (this.valueField === DisplayInfo.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this.valueField];
    }

    return value;
  }



  // -------------------------------------------------------------------------------------
  // Property dataServiceRequests
  // -------------------------------------------------------------------------------------
  public get dataServiceRequests(): ICrudServiceRequests<IEntity<any>, any> {
    return this._dataServiceRequests;
  }

  @Input() public set dataServiceRequests(value: ICrudServiceRequests<IEntity<any>, any>) {
    if (this._dataServiceRequests !== value) {
      this._dataServiceRequests = value;
    }
  }


  // -------------------------------------------------------------------------------------
  // Property item und der Change Event
  // -------------------------------------------------------------------------------------

  protected onItemChange(value: any) {
    using(new XLog(EnumValueComponent.logger, levels.INFO, 'onItemChange'), (log) => {
      if (log.isInfoEnabled()) {
        log.log(`value = ${Core.stringify(value)}`);
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


  // -------------------------------------------------------------------------------------
  // Property item und der Change Event
  // -------------------------------------------------------------------------------------

  protected onItemSelectorChange(value: any) {
    using(new XLog(EnumValueComponent.logger, levels.INFO, 'onItemSelectorChange'), (log) => {
      if (log.isInfoEnabled()) {
        log.log(`value = ${Core.stringify(value)}`);
      }
      this.itemSelectorChange.emit(value);

      this.updateItem();
    });
  }

  public get itemSelector(): any {
    return this._itemSelector;
  }

  @Input() public set itemSelector(value: any) {
    if (this._itemSelector !== value) {
      this._itemSelector = value;
      this.onItemSelectorChange(value);
    }
  }


  private updateItem() {
    if (this.items) {
      const itemsFiltered = this.items.filter((item) => this.getValue(item) === this.itemSelector);
      if (itemsFiltered && itemsFiltered.length === 1) {
        this.item = itemsFiltered[0];
      }
    }

  }

}