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
import { ListSelectorComponent } from '../common';
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
  <p>selectedIndex: {{selectedIndex}}, selectedValue: {{selectedValue | json}}</p>
</div>
`,
  styles: []
})
export class DropdownSelectorComponent extends ListSelectorComponent {
  protected static logger = getLogger(DropdownSelectorComponent);

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
   * Die Dropdownkonfiguration.
   *
   * @type {IDropdownAdapterOptions}
   * @memberOf DropdownSelectorComponent
   */
  private _config: IDropdownSelectorConfig;

  public configInternal: IDropdownSelectorConfig;


  /**
   * falls true, wird ein künstlicher erster Eintrag mit dem Text des Members
   * allowNoSelectionText erzeugt
   *
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() public allowNoSelection: boolean = false;

  /**
   * falls true, wird dieser Text als ein künstlicher erster Eintrag verwendet
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() public allowNoSelectionText: string = DropdownSelectorComponent.ALLOW_NO_SELECTION_TEXT;

  /**
   * setzt das autoWidth-Attribut von p-dropdown
   *
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() public autoWidth: boolean = true;


  /**
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() public textField: string;

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'selectedValue' übernommen werden soll.
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() public valueField: string;

  /**
   * Die an die PrimtNG angebundenen Werte
   *
   * @type {any[]}
   * @memberOf DropdownSelectorComponent
   */
  public options: SelectItem[];

  private dataItems: any[];


  constructor(router: Router, metadataService: MetadataService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, changeDetectorRef);
  }


  public ngOnInit() {
    super.ngOnInit();
  }



  public get config(): IDropdownSelectorConfig {
    return this._config;
  }

  @Input() public set config(value: IDropdownSelectorConfig) {
    this._config = value;
    this.initBoundData(this.dataItems, this.getMetadataForValues(this.dataItems));
  }


  public onChange(value) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      DropdownSelectorComponent.logger.info(`DropdownSelectorComponent.onChange: selectedIndex =` +
        ` ${this.selectedIndex}, value = ${JSON.stringify(value)}`);
    }
  }


  protected initBoundData(items: any[], tableMetadata: TableMetadata) {
    this.options = undefined;
    this.dataItems = undefined;

    super.initBoundData(items, tableMetadata);
  }


  protected setupConfig(items: any[], tableMetadata: TableMetadata) {
    using(new XLog(DropdownSelectorComponent.logger, levels.DEBUG, 'setupConfig'), (log) => {
      if (log.isDebugEnabled) {
        log.log(`no of items = ${items ? items.length : 'undefined'},` +
          ` tableMetadata = ${tableMetadata ? tableMetadata.className : 'undefined'}`);
      }


      //
      // config überschreibt text/valueField Settings ???
      //
      if (this.config) {
        const config = Clone.clone(this.config);

        if (!config.displayInfo) {
          config.displayInfo = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo;
        }

        if (!config.displayInfo.textField) {
          config.displayInfo.textField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.textField;
        }
        if (!config.displayInfo.valueField) {
          config.displayInfo.valueField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.valueField;
        }


        if (!config.displayInfo.dataType && tableMetadata) {
          const colMetaData = tableMetadata.getColumnMetadataByProperty(config.displayInfo.valueField);
          if (colMetaData) {
            config.displayInfo.dataType = DataTypes.mapColumnTypeToDataType(colMetaData.propertyType);
          }
        }



        if (!config.allowNoSelection) {
          config.allowNoSelection = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelection;
        }
        if (!config.allowNoSelectionText) {
          config.allowNoSelectionText = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelectionText;
        }

        this.configInternal = config;

      } else {

        //
        // es existiert keine Config und weder textField noch valueField sind angegeben
        //
        if (StringUtil.isNullOrEmpty(this.textField) && StringUtil.isNullOrEmpty(this.valueField)) {
          // metadata/reflect
          if (tableMetadata) {
            this.setupColumnInfosByMetadata(items, tableMetadata);
          } else {
            this.setupColumnInfosByReflection(items);
          }
        } else {

          // fehlt das valueField, wird als Default CURRENT_ITEM verwendet
          if (StringUtil.isNullOrEmpty(this.valueField)) {
            this.valueField = DisplayInfo.CURRENT_ITEM;
          }

          this.configInternal = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);
          this.configInternal.displayInfo.textField = this.textField;
          this.configInternal.displayInfo.valueField = this.valueField;

          if (this.allowNoSelection) {
            this.configInternal.allowNoSelection = this.allowNoSelection;
          }

          if (this.allowNoSelectionText) {
            this.configInternal.allowNoSelectionText = this.allowNoSelectionText;
          }
        }
      }

      if (log.isDebugEnabled) {
        log.log(`configInternal : ${JSON.stringify(this.configInternal)}`);
      }
    });
  }


  protected setupData(items: any[]) {
    this.dataItems = items;

    if (items && items.length > 0) {
      this.options = [];

      // ... und dann entsprechende Option-Objekte erzeugen
      for (const item of items) {
        this.options.push({
          label: this.getText(item),
          value: this.getValue(item)
        });
      }
    }
  }



  protected get isDataEmpty(): boolean {
    return !(this.dataItems && this.dataItems.length > 0);
  }

  protected getDataValue(index: number): any {
    return this.getValue(this.dataItems[index]);
  }

  protected get dataLength(): number {
    if (this.isDataEmpty) {
      return 0;
    }
    return this.dataItems.length;
  }


  /**
   * Liefert den Anzeigetext für das Item @param{item}
   */
  protected getText(item: any): string {
    let text: string;

    if (this.configInternal.displayInfo.textField === DisplayInfo.CURRENT_ITEM) {
      text = item.toString();
    } else {
      text = item[this.configInternal.displayInfo.textField];
    }

    return text;
  }

  /**
   * Liefert den Wert für das Item @param{item} (wird bei Änderung der Selektion angebunden)
   * Konfiguration muss berücksichtigt werden.
   */
  protected getValue(item: any): any {
    let value: any;

    if (this.configInternal.displayInfo.valueField === DisplayInfo.CURRENT_ITEM) {
      value = item;
    } else {
      value = item[this.configInternal.displayInfo.valueField];
    }

    return value;
  }


  /**
   * Liefert den Index des Werts (selectedValue) in der Optionsliste
   * 
   * @protected
   * @param {*} value
   * @returns {number}
   * 
   * @memberOf DropdownSelectorComponent
   */
  protected indexOfValue(value: any): number {
    let indexFound = -1;
    if (this.options) {
      for (let index = 0; index < this.options.length; index++) {
        const option = this.options[index];
        if (option.value === value) {
          indexFound = index;
          break;
        }
      }
    }

    return indexFound;
  }



  /**
   * falls keine Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   *
   */
  private setupColumnInfosByMetadata(items: any[], tableMetadata: TableMetadata) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');
    Assert.notNull(tableMetadata);

    const config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

    const columnInfos: IDisplayInfo[] = [];

    // default: erste Property
    let displayMetadataName: string = tableMetadata.columnMetadata[0].propertyName;

    const metaDataWithDisplayName = tableMetadata.columnMetadata.filter(
      (item) => item.options.displayName && item.propertyType === 'string');

    if (metaDataWithDisplayName && metaDataWithDisplayName.length > 0) {
      // erste string-Propery mit gesetztem Displaynamen
      displayMetadataName = metaDataWithDisplayName[0].propertyName;
    }

    config.displayInfo.textField = displayMetadataName;
    config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;

    this.configInternal = config;
  }


  /**
   * falls keine Konfiguration angegeben ist, wird diese über die Reflection erzeugt
   *
   */
  private setupColumnInfosByReflection(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    if (items && items.length > 0) {
      const config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

      const firstItem = items[0];
      let firstPropName: string;

      if (typeof firstItem === 'object') {
        // alle Properties des ersten Items über Reflection ermitteln        
        const props = Reflect.ownKeys(firstItem);

        // ... und dann entsprechende ColumnInfos erzeugen
        for (const prop of props) {

          // erste Property merken: default
          if (!firstPropName) {
            firstPropName = prop.toString();
          }

          const value = firstItem[prop];

          // erste string Property merken
          if (typeof value === 'string') {
            firstPropName = prop.toString();
            break;
          }
        }

        config.displayInfo.textField = firstPropName;
        config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
      } else {
        // primitive Typen direkt anzeigen/anbinden
        config.displayInfo.textField = DisplayInfo.CURRENT_ITEM;
        config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
      }

      this.configInternal = config;
    }
  }

}