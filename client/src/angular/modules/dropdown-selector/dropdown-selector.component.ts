// Angular
import { Component, Input, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { Router } from '@angular/router';


// PrimeNG
import { SelectItem } from 'primeng/primeng';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import { IService, TableMetadata } from '@fluxgate/common';
import { Assert, Clone, Types, Utility } from '@fluxgate/core';


import { DataTypes, DisplayInfo, } from '../../../base';
import { CacheService } from '../../services/cache.service';
import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';
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
<p-dropdown [(options)]="options" [style]="style" [(ngModel)]="value"
  [readonly]="readonly"
  (onChange)="onChange($event.value)">
</p-dropdown>

<div *ngIf="debug">
  <p>selectedIndex: {{selectedIndex}}, value: {{value | json}}</p>
</div>
`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownSelectorComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DropdownSelectorComponent,
      multi: true,
    }
  ]
})
export class DropdownSelectorComponent extends ListSelectorComponent<any> {
  protected static logger = getLogger(DropdownSelectorComponent);

  public static readonly ALLOW_NO_SELECTION_TEXT = '(Auswahl)';

  /**
   * Defaultoptionen
   */
  public static DEFAULT_CONFIG: IDropdownSelectorConfig = {
    displayInfo: DisplayInfo.DEFAULT,
    allowNoSelection: true,
    allowNoSelectionText: DropdownSelectorComponent.ALLOW_NO_SELECTION_TEXT,
    valuesCacheable: false
  };


  @ViewChild(NgModel) public model: NgModel;

  @Input() public readonly: boolean;

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
  @Input() public autoWidth: boolean;


  /**
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  private _textField: string;

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'value' übernommen werden soll.
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  private _valueField: string;

  /**
   * Die an die PrimtNG angebundenen Werte
   *
   * @type {any[]}
   * @memberOf DropdownSelectorComponent
   */
  public options: SelectItem[];

  private dataItems: any[];


  constructor(router: Router, metadataService: MetadataService, messageService: MessageService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, metadataService, messageService, changeDetectorRef);
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();
  }


  public validate(control: FormControl): { [key: string]: any } {
    return (!this.parseError) ? null : {
      dropdownError: {
        valid: false
      },
    };
  }


  public get config(): IDropdownSelectorConfig {
    return this._config;
  }

  @Input() public set config(value: IDropdownSelectorConfig) {
    this._config = value;
    this.initBoundData(this.dataItems, this.getMetadataForValues(this.dataItems));
  }


  public get textField(): string {
    return this._textField;
  }

  @Input() public set textField(value: string) {
    this._textField = value;
    this.initBoundData(this.dataItems, this.getMetadataForValues(this.dataItems));
  }


  public get valueField(): string {
    return this._valueField;
  }

  @Input() public set valueField(value: string) {
    this._valueField = value;
    this.initBoundData(this.dataItems, this.getMetadataForValues(this.dataItems));
  }



  public onChange(value: any) {
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
        if (!Types.isPresent(config.displayInfo.required)) {
          config.displayInfo.required = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.required;
        }


        if (!config.displayInfo.dataType && tableMetadata) {
          const colMetaData = tableMetadata.getColumnMetadataByProperty(config.displayInfo.valueField);
          if (colMetaData) {
            config.displayInfo.dataType = DataTypes.mapColumnTypeToDataType(colMetaData.propertyType);
          }
        }


        if (!Types.isPresent(config.allowNoSelection)) {
          config.allowNoSelection = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelection;
        }
        if (!Types.isPresent(config.allowNoSelectionText)) {
          config.allowNoSelectionText = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelectionText;
        }
        if (!Types.isPresent(config.valuesCacheable)) {
          config.valuesCacheable = DropdownSelectorComponent.DEFAULT_CONFIG.valuesCacheable;
        }

        this.configInternal = config;

      } else {

        //
        // es existiert keine Config und weder textField noch valueField sind angegeben
        //
        if (Utility.isNullOrEmpty(this.textField) && Utility.isNullOrEmpty(this.valueField)) {
          // metadata/reflect
          if (tableMetadata) {
            this.setupColumnInfosByMetadata(items, tableMetadata);
          } else {
            this.setupColumnInfosByReflection(items);
          }
        } else {

          // fehlt das valueField, wird als Default CURRENT_ITEM verwendet
          if (Utility.isNullOrEmpty(this.valueField)) {
            this.valueField = DisplayInfo.CURRENT_ITEM;
          }

          this.configInternal = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);
          this.configInternal.displayInfo.textField = this.textField;
          this.configInternal.displayInfo.valueField = this.valueField;
        }
      }

      if (Types.isPresent(this.allowNoSelection)) {
        Assert.that(Types.isBoolean(this.allowNoSelection));
        this.configInternal.allowNoSelection = this.allowNoSelection;
      }

      if (Types.isPresent(this.allowNoSelectionText)) {
        this.configInternal.allowNoSelectionText = this.allowNoSelectionText;
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

      if (this.configInternal.allowNoSelection) {
        this.options.push({
          label: this.configInternal.allowNoSelectionText,
          value: {}
        });
      }

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
   * Liefert den Index des Werts (value) in der Optionsliste
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



  protected createDataService(service: IService<any, any>) {
    if (this.configInternal && this.configInternal.valuesCacheable) {
      return new CacheService(service);
    }
    return service;
  }



  /**
   * falls keine Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   *
   */
  private setupColumnInfosByMetadata(items: any[], tableMetadata: TableMetadata) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');
    Assert.notNull(tableMetadata);

    const config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

    const colMetadata = tableMetadata.columnMetadata[0];

    // default: erste Property
    let displayMetadataName: string = colMetadata.propertyName;

    const metaDataWithDisplayName = tableMetadata.columnMetadata.filter(
      (item) => item.options.displayName && item.propertyType === 'string');

    if (metaDataWithDisplayName && metaDataWithDisplayName.length > 0) {
      // erste string-Propery mit gesetztem Displaynamen
      displayMetadataName = metaDataWithDisplayName[0].propertyName;
    }


    const metaDataWithEnum = tableMetadata.columnMetadata.filter(
      (item) => item.enumMetadata);
    if (metaDataWithEnum && metaDataWithEnum.length > 0) {
      // erste Enum-Propery
      config.valuesCacheable = metaDataWithEnum[0].enumMetadata.cacheable;
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
          if (Types.isString(value)) {
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