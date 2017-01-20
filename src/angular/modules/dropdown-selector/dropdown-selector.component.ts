// Angular
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { IDropdownAdapter } from '../../common/adapter';


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
<p-dropdown [options]="dropdownAdapter.data" [autoWidth]="autoWidth" [style]="style" [(ngModel)]="selectedValue" 
    (onChange)="onSelectionChanged($event.value)">
</p-dropdown>

<div *ngIf="debug">
  <p>Selected Item: {{selectedValue | json}}</p>
</div>
`,
  styles: []
})
export class DropdownSelectorComponent implements OnInit {

  /**
   * falls true, wird beim Control eine Testausgabe eingeblendet
   * 
   * @type {boolean}
   * @memberOf DropdownSelectorComponent
   */
  @Input() debug: boolean = true;     // TODO: wenn implementierung fertig auf false setzen

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
  @Input() allowNoSelectionText: string = 'Auswahl';

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
   * setzt den Index des zu selektierenden Eintrags (erster Eintrag: 0)
   * 
   * @type {number}
   * @memberOf DropdownSelectorComponent
   */
  @Input() selectedIndex: number = -1;


  /**
   * der zugehörige Adapter für die Anbindung der Daten für die Werteliste
   * 
   * @type {IDropdownAdapter}
   * @memberOf DropdownSelectorComponent
   */
  @Input() dropdownAdapter: IDropdownAdapter;


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
   * der selectedValueChanged-Event: Event-Parameter ist der selectedValue.
   * 
   * @memberOf DropdownSelectorComponent
   */
  @Output() selectedValueChanged = new EventEmitter<any>();


  /**
   * Der ausgewählte Wert.
   * 
   * @type {*}
   * @memberOf DropdownSelectorComponent
   */
  @Input() selectedValue: any = {};
  

  constructor() {
  }

  ngOnInit() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.dropdownAdapter.data.length) {
      this.dropdownAdapter.getValueAt(this.selectedIndex)
        .subscribe(item => this.selectedValue = item);
    }
  }

  ngOnDestroy() {
  }

  public onSelectionChanged(value) {
    if (this.debug) {
      console.log(`DropdownSelectorComponent.onSelectionChanged: ${JSON.stringify(value)}`);
    }
    this.selectedValueChanged.emit(value);
  }
}