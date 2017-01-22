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
  <p>Selected Item: {{selectedValue | json}}</p>
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
  public options: SelectItem[] = [];


  constructor(router: Router, service: ProxyService, metadataService: MetadataService,
    changeDetectorRef: ChangeDetectorRef) {
    super(router, service, metadataService, changeDetectorRef);
  }


  ngOnInit() {
    super.ngOnInit();
  }


  protected setupConfig(items: any[], useService: boolean) {

    //
    // config überschreibt text/valueField Settings ???
    //
    if (this.config) {
      // TODO: Wegen defaults bei text/valueField nicht notwendig -> ist das so ok? 
      //  Assert.that(!this.textField, `Wenn Property config gesetzt ist, darf textField nicht gleichzeitig gesetzt sein.`);
      //  Assert.that(!this.valueField, `Wenn Property config gesetzt ist, darf valueField nicht gleichzeitig gesetzt sein.`);

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
    } else {

      //
      // 
      //
      if (StringUtil.isNullOrEmpty(this.textField) && StringUtil.isNullOrEmpty(this.valueField)) {
        // metadata/reflect
        if (useService) {
          this.setupColumnInfosByMetadata(items);
        } else {
          this.setupColumnInfosByReflection(items);
        }
      } else {
        this.config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);
        this.config.displayInfo.textField = this.textField;
        this.config.displayInfo.valueField = this.valueField;

        if (this.allowNoSelection) {
          this.config.allowNoSelection = this.allowNoSelection;
        }

        if (this.allowNoSelectionText) {
          this.config.allowNoSelectionText = this.allowNoSelectionText;
        }
      }
    }
  }

  protected setupData(items: any[]) {
    if (items && items.length > 0) {

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

    if (!this.config) {
      this.config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

      let columnInfos: IDisplayInfo[] = [];

      let tableMetadata = this.metadataService.findTableMetadata(this.dataService.getModelClassName());

      // default: erste Property
      let displayMetadataName: string = tableMetadata.columnMetadata[0].propertyName;

      let metaDataWithDisplayName = tableMetadata.columnMetadata.filter(item => item.options.displayName && item.propertyType === 'string');
      if (metaDataWithDisplayName && metaDataWithDisplayName.length > 0) {
        // erste string-Propery mit gesetztem Displaynamen
        displayMetadataName = metaDataWithDisplayName[0].propertyName;
      }

      this.config.displayInfo.textField = displayMetadataName;
      this.config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
    }
  }


  /**
    * falls keine Konfiguration angegeben ist, wird diese über die Reflection erzeugt
    *
    */
  private setupColumnInfosByReflection(items: any[]) {
    if (!this.config) {
      if (items && items.length > 0) {
        this.config = Clone.clone(DropdownSelectorComponent.DEFAULT_CONFIG);

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

          this.config.displayInfo.textField = firstPropName;
          this.config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
        } else {
          // primitive Typen direkt anzeigen/anbinden
          this.config.displayInfo.textField = DisplayInfo.CURRENT_ITEM;
          this.config.displayInfo.valueField = DisplayInfo.CURRENT_ITEM;
        }
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


}