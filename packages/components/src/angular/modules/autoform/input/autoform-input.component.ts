// Angular
import { Component, Input } from '@angular/core';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

// Fluxgate
import {
  ControlBaseComponent,
  DataTypes, DisplayInfo, FormAction, FormActions, IControlDisplayInfo
} from '@fluxgate/client';
import { IService, TableMetadata } from '@fluxgate/common';
import { Assert, Clone, Core, Types, Utility } from '@fluxgate/core';


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
  selector: 'flx-autoform-input',
  template: `
  <div class="form-group" *ngIf="! isHidden(info, dataItem)">
    <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

    <div class="col-sm-10">
      <input [(ngModel)]="dataItem[info.valueField [type]="getInputType(info)"
        [required]="info.required" [readonly]="isReadonly(info)"
        [style.color]="getColor(dataItem, info)"
      >
    </div>

    <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
      {{ getFormErrors(info.valueField) }}
    </div>

  </div>
`,
  styles: []
})
export class AutoformInputComponent {
  protected static logger = getLogger(AutoformInputComponent);

  @Input() public info: IControlDisplayInfo;
  @Input() public dataItem: any;



  /**
   * Liefert true, falls Feld zu @param{metadata} nicht anzuzeigen ist
   *
   * @param {IControlDisplayInfo} info
   * @param value
   * @returns {boolean}
   */
  public isHidden(info: IControlDisplayInfo, value: any): boolean {
    // Default: Anzeige, falls displayName im Model gesetzt ist
    const rval = info.textField === undefined;

    // Feld aber nicht anzeigen, falls in hiddenFileds angegeben

    // TODO
    // if (this.configInternal.hiddenFields && this.configInternal.hiddenFields.indexOf(info.valueField) >= 0) {
    //   rval = true;
    // }

    return rval;
  }


  /**
   * Liefert true, falls die Daten nicht änderbar sind
   *
   * @param {IControlDisplayInfo} info
   * @returns {boolean}
   */
  public isReadonly(info: IControlDisplayInfo, action: FormAction): boolean {
    return !info.editable || action === FormActions.VIEW;
  }


  /**
   * Liefert den Typ eines html-input Fields für die angegebene Info @see{info}
   *
   * @param {IControlDisplayInfo} info
   * @returns {string}
   */
  public getInputType(info: IControlDisplayInfo): string {
    if (info.isSecret) {
      return 'password';
    } else {
      return 'text';
    }
  }


  /**
   * Liefert die Validierungsfehler für das angegebene Control @param{controlName} und die
   * FormGroup @param{groupName}
   *
   * @protected
   * @param {string} controlName
   * @param {string} [groupName=FormGroupInfo.DEFAULT_NAME]
   * @returns {string}
   *
   * @memberOf CoreComponent
   */
  public getFormErrors(controlName: string, groupName: string = 'TODO'): string {
    Assert.notNullOrEmpty(controlName);
    Assert.notNullOrEmpty(groupName);
    // const formInfo = this.formInfos.get(groupName);
    // return formInfo.getFormErrors(controlName);
    return '';        // TODO
  }

}