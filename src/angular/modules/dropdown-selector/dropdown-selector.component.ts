// Angular
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';

import {MetadataService, ProxyService} from '../../services';

import {DisplayInfo} from '../../../base';

import {IDropdownSelectorConfig} from './dropdown-selectorConfig.interface';
import {ListSelectorComponent} from '../common/list-selector.component';

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
     * Die an die PrimtNG angebundenen Werte
     *
     * @type {any[]}
     * @memberOf DropdownSelectorComponent
     */
    public options: any[] = [];


    constructor(router: Router, service: ProxyService, metadataService: MetadataService,
                changeDetectorRef: ChangeDetectorRef) {
        super(router, service, metadataService, changeDetectorRef);
    }


    ngOnInit() {
        super.ngOnInit();
    }

    setupConfig() {
        super.setupConfig();

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
    }

    protected preselectData() {
        super.preselectData();
    }

    /**
     * falls keine Column-Konfiguration angegeben ist, wird diese über die Metadaten erzeugt
     *
     * @private
     *
     * @memberOf DataTableSelectorComponent
     */
    protected setupColumnInfosByMetadata() {
        super.setupColumnInfosByMetadata();

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


    protected setupColumnInfosByReflection() {
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


}