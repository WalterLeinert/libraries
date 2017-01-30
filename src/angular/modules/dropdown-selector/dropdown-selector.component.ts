// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


// PrimeNG
import { SelectItem } from 'primeng/primeng';

// Fluxgate
import { Assert, StringUtil, Clone, ColumnMetadata } from '@fluxgate/common';

import { MetadataService, ProxyService } from '../../services';

import { DisplayInfo, IDisplayInfo } from '../../../base';

import { IDropdownSelectorConfig } from './dropdown-selectorConfig.interface';
import { ListSelectorComponent } from '../common/list-selector.component';

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
   * Die Property in der angebundenen Werteliste, welche in der Dropbox angezeigt werden soll
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() textField: string;

  /**
   * Die Property in der angebundenen Werteliste, welche nach Auswahl
   * als 'selectedValue' übernommen werden soll.
   *
   * @type {string}
   * @memberOf DropdownSelectorComponent
   */
  @Input() valueField: string;

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


  ngOnInit() {
    super.ngOnInit();
  }


  protected setupConfig(items: any[], useService: boolean) {

    //
    // config überschreibt text/valueField Settings ???
    //
    if (this.config) {
      this.configInternal = Clone.clone(this.config);

      // TODO: Wegen defaults bei text/valueField nicht notwendig -> ist das so ok? 
      //  Assert.that(!this.textField, `Wenn Property config gesetzt ist, darf textField nicht gleichzeitig gesetzt sein.`);
      //  Assert.that(!this.valueField, `Wenn Property config gesetzt ist, darf valueField nicht gleichzeitig gesetzt sein.`);

      if (!this.configInternal.displayInfo) {
        this.configInternal.displayInfo = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo;
      }

      if (!this.configInternal.displayInfo.textField) {
        this.configInternal.displayInfo.textField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.textField;
      }
      if (!this.configInternal.displayInfo.valueField) {
        this.configInternal.displayInfo.valueField = DropdownSelectorComponent.DEFAULT_CONFIG.displayInfo.valueField;
      }

      if (!this.configInternal.allowNoSelection) {
        this.configInternal.allowNoSelection = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelection;
      }
      if (!this.configInternal.allowNoSelectionText) {
        this.configInternal.allowNoSelectionText = DropdownSelectorComponent.DEFAULT_CONFIG.allowNoSelectionText;
      }

      return;
    }



    //
    // es existiert keine Config und weder textField noch valueField sind angegeben
    //
    if (StringUtil.isNullOrEmpty(this.textField) && StringUtil.isNullOrEmpty(this.valueField)) {
      // metadata/reflect
      if (useService) {
        this.setupColumnInfosByMetadata(items);
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


  protected setupData(items: any[]) {
    this.dataItems = items;

    if (items && items.length > 0) {
      this.options = [];

      // ... und dann entsprechende Option-Objekte erzeugen
      for (let item of items) {
        this.options.push({
          label: this.getText(item),
          value: this.getValue(item)
        });
      }
    }
  }


  /**
   * falls keine Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
   *
   */
  private setupColumnInfosByMetadata(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    this.configInternal = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

    let columnInfos: IDisplayInfo[] = [];

    let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());

    // default: erste Property
    let displayMetadataName: string = tableMetadata.columnMetadata[0].propertyName;

    let metaDataWithDisplayName = tableMetadata.columnMetadata.filter(item => item.options.displayName && item.propertyType === 'string');
    if (metaDataWithDisplayName && metaDataWithDisplayName.length > 0) {
      // erste string-Propery mit gesetztem Displaynamen
      displayMetadataName = metaDataWithDisplayName[0].propertyName;
    }

    this.configInternal.displayInfo.textField = displayMetadataName;
    this.configInternal.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
  }


  /**
    * falls keine Konfiguration angegeben ist, wird diese über die Reflection erzeugt
    *
    */
  private setupColumnInfosByReflection(items: any[]) {
    Assert.that(!this.config, 'config muss hier immer undefiniert sein.');

    if (items && items.length > 0) {
      this.configInternal = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

      let firstItem = items[0];
      let firstPropName: string;

      if (typeof firstItem === 'object') {
        // alle Properties des ersten Items über Reflection ermitteln        
        let props = Reflect.ownKeys(firstItem);

        // ... und dann entsprechende ColumnInfos erzeugen
        for (let prop of props) {

          // erste Property merken: default
          if (!firstPropName) {
            firstPropName = prop.toString();
          }

          let value = firstItem[prop];

          // erste string Property merken
          if (typeof value === 'string') {
            firstPropName = prop.toString();
            break;
          }
        }

        this.configInternal.displayInfo.textField = firstPropName;
        this.configInternal.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
      } else {
        // primitive Typen direkt anzeigen/anbinden
        this.configInternal.displayInfo.textField = DisplayInfo.CURRENT_ITEM;
        this.configInternal.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
      }
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
  protected preselectData() {
    if (!this.isPreselecting) {
      this.isPreselecting = true;

      try {
        if (!this.dataItems) {
          return;
        }
        if (this.selectedIndex >= 0 && this.selectedIndex < this.dataItems.length) {
          this.selectedValue = this.getValue(this.dataItems[this.selectedIndex]);
        } else if (this.dataItems.length > 0) {
          this.selectedValue = this.getValue(this.dataItems[0]);
        }
      } finally {
        this.isPreselecting = false;
      }
    }
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
        let option = this.options[index];
        if (option.value === value) {
          indexFound = index;
          break;
        }
      }
    }

    return indexFound;
  }


  public get config(): IDropdownSelectorConfig {
    return this._config;
  }

  @Input() public set config(value: IDropdownSelectorConfig) {
    this._config = value;
    this.setupConfig(this.dataItems, false);
  }


  public onChange(value) {
    this.changeDetectorRef.detectChanges();
    if (this.debug) {
      console.log(`DropdownSelectorComponent.onChange: selectedIndex = ${this.selectedIndex}, value = ${JSON.stringify(value)}`);
    }
  }

}