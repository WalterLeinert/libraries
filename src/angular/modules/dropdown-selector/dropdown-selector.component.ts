// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Fluxgate
import { TableMetadata, ColumnMetadata, ColumnTypes, Constants, Assert } from '@fluxgate/common';

import { Service, IService } from '../../services';
import { MetadataService, ProxyService } from '../../services';
import { BaseComponent, IDisplayInfo, DisplayInfo } from '../../common/base';

import { IDropdownSelectorConfig } from './dropdown-selectorConfig.interface';

/**
 * Fluxgate Dropdown-Komponente
 * 
 * Kapselt die Dropdown-Konmponente von PrimeNG.
 * 
 * @export
 * @class DropdownSelectorComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'flx-dropdown-selector',
  template: `
<p-dropdown [(options)]="options" [autoWidth]="autoWidth" [style]="style" [(ngModel)]="selectedValue" 
    (onChange)="onChange($event.value)">
</p-dropdown>

<div *ngIf="debug">
  <p>Selected Item: {{selectedValue | json}}</p>
</div>
`,
  styles: []
})
export class DropdownSelectorComponent extends BaseComponent<ProxyService> {
  public static readonly ALLOW_NO_SELECTION_TEXT = '(Auswahl)';

  /**
   * Defaultoptionen
   */
  public static DEFAULT_CONFIG: IDropdownSelectorConfig = {
    displayInfo: DisplayInfo.DEFAULT,
    allowNoSelection: true,
    allowNoSelectionText: DropdownSelectorComponent.ALLOW_NO_SELECTION_TEXT
  };


  /**
   * Schutz vor rekursivem Ping-Pong
   */
  private isPreselecting: boolean = false;


  /**
   * falls true, wird beim Control eine Testausgabe eingeblendet
   * 
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() debug: boolean = true;     // TODO: wenn implementierung fertig auf false setzen

  /**
   * Die Dropdownkonfiguration.
   * 
   * @type {IDropdownAdapterOptions}
   * @memberOf DropdownSelectorComponent
   */
  @Input() config: IDropdownSelectorConfig;


  /**
   * falls true, wird ein künstlicher erster Eintrag mit dem Text des Members 
   * allowNoSelectionText erzeugt   
   * 
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() allowNoSelection: boolean = false;

  /**
    * falls true, wird dieser Text als ein künstlicher erster Eintrag verwendet
    * 
    * @type {string}
    * @memberOf DropdownSelectorComponent
    */
  @Input() allowNoSelectionText: string = DropdownSelectorComponent.ALLOW_NO_SELECTION_TEXT;

  /**
   * setzt das autoWidth-Attribut von p-dropdown
   * 
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() autoWidth: boolean = true;


  /**
   * * setzt das style-Attribut von p-dropdown
   * 
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() style: string;

  /**
   * angebundene Objektliste statt Liste von Entities aus DB.
   * 
   * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
   * 
   * @type {any[]}
   * @memberOf DataTableSelectorComponent
   */
  private _data: any[];

  /**
   * dataChange Event: wird bei jeder SelektionÄänderung von data gefeuert.
   * 
   * Eventdaten: @type{any} - selektiertes Objekt.
   * 
   * @memberOf DataTableSelectorComponent
   */
  @Output() dataChange = new EventEmitter<any>();


  /**
 * der Service zum Bereitstellen der Daten
 * 
 * Hinweis: data und dataService dürfen nicht gleichzeitig gesetzt sein!
 * 
 * @type {IService}
 * @memberOf DataTableSelectorComponent
 */
  @Input() dataService: IService;


  /**
   * setzt den Index des zu selektierenden Eintrags (erster Eintrag: 0)
   * 
   * @type {number}
   * @memberOf DropdownSelectorComponent
   */
  private _selectedIndex: number = -1;

  /**
   * selectedIndexChange Event: wird bei jeder Änderung von selectedIndex gefeuert.
   * 
   * Eventdaten: @type{any} - selektiertes Objekt.
   * 
   * @memberOf DataTableSelectorComponent
   */
  @Output() selectedIndexChange = new EventEmitter<number>();


  /**
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   * 
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() textField: string = 'text';

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl 
   * als 'selectedValue' übernommen werden soll.
   * 
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() valueField: string = 'value';



  /**
   * der selectedValueChange-Event: Event-Parameter ist der selectedValue.
   * 
   * @memberOf DropdownSelectorComponent
   */
  @Output() selectedValueChange = new EventEmitter<any>();


  /**
   * Der ausgewählte Wert.
   * 
   * @type {*}
   * @memberOf DropdownSelectorComponent
   */
  private _selectedValue: any;


  /**
   * Die an die PrimtNG angebundenen Werte
   * 
   * @type {any[]}
   * @memberOf DropdownSelectorComponent
   */
  public options: any[] = [];


  constructor(router: Router, service: ProxyService, private metadataService: MetadataService,
    private changeDetectorRef: ChangeDetectorRef) {
    super(router, service);
  }


  ngOnInit() {
    super.ngOnInit();

    if (!this.config) {
      this.config = DropdownSelectorComponent.DEFAULT_CONFIG;
    } else {
      if (!this.config.displayInfo) {
        this.config.displayInfo = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo;
      }

      if (!this.config.displayInfo.textField) {
        this.config.displayInfo.textField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.textField;
      }
      if (!this.config.displayInfo.valueField) {
        this.config.displayInfo.valueField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.valueField;
      }

      if (!this.config.allowNoSelection) {
        this.config.allowNoSelection = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelection;
      }
      if (!this.config.allowNoSelectionText) {
        this.config.allowNoSelectionText = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelectionText;
      }
    }


    if (this.data) {
      Assert.that(!this.dataService, `Wenn Property data gesetzt ist, darf dataService nicht gleichzeitig gesetzt sein.`);

      this.preselectData();
      this.setupColumnInfosByReflection();
    } else {
      Assert.notNull(this.dataService, `Wenn Property data nicht gesetzt ist, muss dataService gesetzt sein.`);

      this.service.proxyService(this.dataService);

      // this.setupProxy(this.entityName);
      this.service.find()
        .subscribe(items => {
          this.data = items;

          this.preselectData();
          this.setupColumnInfosByMetadata();
        },
        (error: Error) => {
          this.handleError(error);
        });
    }
  }


  /**
  * Falls ein positiver und gültiger selectedIndex angegeben ist, wird der selectedValue auf des 
  * entsprechende Item gesetzt. 
  * 
  * @private
  * 
  * @memberOf DataTableSelectorComponent
  */
  private preselectData() {
    if (!this.isPreselecting) {
      this.isPreselecting = true;

      try {
        // TODO

        // if (!this.options) {
        //   return;
        // }
        // if (this.selectedIndex >= 0 && this.selectedIndex < this.options.length) {
        //   this.selectedValue = this.options[this.selectedIndex];
        // } else if (this.data.length > 0) {
        //   this.selectedValue = this.data[0];
        // }
      } finally {
        this.isPreselecting = false;
      }
    }
  }


  /**
   * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   * 
   * @private
   * 
   * @memberOf DataTableSelectorComponent
   */
  private setupColumnInfosByMetadata() {

    // TODO
    // if (!this.config) {
    //   let columnInfos: IColumnInfo[] = [];

    //   let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());
    //   let columnMetadata = tableMetadata.columnMetadata;

    //   for (let cm of tableMetadata.columnMetadata) {
    //     if (cm.options.displayName) {
    //       columnInfos.push(<IColumnInfo>{
    //         textField: cm.options.displayName,
    //         valueField: cm.propertyName
    //       });
    //     }
    //   }

    //   this.config = {
    //     columnInfos: columnInfos
    //   }
    // }
  }



  private setupColumnInfosByReflection() {
    // TODO
    if (this.data && this.data.length > 0) {

      // ... und dann entsprechende Option-Objekte erzeugen
      for (let item of this.data) {
        this.options.push({
          label: this.getText(item),
          value: this.getValue(item)
        });
      }
    }
  }


  /**
    * Liefert den Anzeigetext für das Item @param{item}
    */
  protected getText(item: any): string {
    let text: string;

    if (this.config.displayInfo.textField === DisplayInfo.CURRENT_ITEM) {
      text = item.toString();
    } else {
      text = item[this.config.displayInfo.textField];
    }

    return text;
  }

  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   */
  protected getValue(item: any): any {
    let value: any;

    if (this.config.displayInfo.valueField === DisplayInfo.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this.config.displayInfo.valueField];
    }

    return value;
  }

  public onChange(value) {
    if (this.debug) {
      console.log(`DropdownSelectorComponent.onChange: ${JSON.stringify(value)}`);
    }
  }

  // -------------------------------------------------------------------------------------
  // Property selectedValue und der Change Event
  // -------------------------------------------------------------------------------------

  protected onSelectedValueChange(value: any) {
    this.selectedValueChange.emit(value);

    this.preselectData();
  }

  public get selectedValue(): any {
    return this._selectedValue;
  }

  @Input() public set selectedValue(value: any) {
    if (this._selectedValue !== value) {
      this._selectedValue = value;
      this.onSelectedValueChange(value);
    }
  }


  // -------------------------------------------------------------------------------------
  // Property selectedIndex und der Change Event
  // -------------------------------------------------------------------------------------

  protected onSelectedIndexChange(index: number) {
    this.selectedIndexChange.emit(index);

    this.preselectData();
  }

  public get selectedIndex(): number {
    return this._selectedIndex;
  }

  @Input() public set selectedIndex(index: number) {
    if (this._selectedIndex !== index) {
      this._selectedIndex = index;
      this.onSelectedIndexChange(index);
    }
  }


  // -------------------------------------------------------------------------------------
  // Property data und der Change Event
  // -------------------------------------------------------------------------------------

  protected onDataChange(value: any) {
    this.dataChange.emit(value);
  }

  public get data(): any {
    return this._data;
  }

  @Input() public set data(data: any) {
    if (this._data !== data) {
      this._data = data;
      this.onDataChange(data);
    }
  }
}