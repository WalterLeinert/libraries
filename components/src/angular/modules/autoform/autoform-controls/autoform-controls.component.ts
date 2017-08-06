// Angular
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------


// Fluxgate
import {
  ControlType,
  CoreComponent, DisplayInfo, FormAction, FormActions, FormGroupInfo,
  IControlDisplayInfo, MessageService
} from '@fluxgate/client';
import { EntityStatus, FilterBehaviour, ICrudServiceRequests, IEntity, StatusFilter } from '@fluxgate/common';
import { Assert, Color, Core } from '@fluxgate/core';

import { IAutoform } from '../autoform.interface';


/**
 * Fluxgate Controls-Komponente
 *
 * Erlaubt die dynamische Anbindung von Controls in Abhängigkeit des Datentyps.
 *
 * @export
 * @class AutoformControlsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'flx-autoform-controls',
  template: `
<div [formGroup]="formGroup">
  <!--
  normale Text-/Eingabefelder
  -->
  <div *ngIf="info.controlType === controlType.Input">

    <div class="form-group" *ngIf="! isHidden(info, dataItem)">
      <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

      <div class="col-sm-10">
        <input [type]="getInputType(info)" class="form-control"
                [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
                [required]="info.required" [readonly]="isReadonly(info)"
                [style.color]="getColor(dataItem, info)"
        >
      </div>

      <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
        {{ getFormErrors(info.valueField) }}
      </div>

    </div>

      <!-- TODO
    <flx-autoform-input [formControlName]="info.valueField" class="form-control" [info]="info" [dataItem]="dataItem" >
    </flx-autoform-input>
    -->
  </div>

  <!--
  Checkbox-Controls für boolean Werte
  -->
  <div *ngIf="info.controlType === controlType.Checkbox">
    <div class="form-group" *ngIf="! isHidden(info, dataItem)">
      <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

      <div class="col-sm-10">
        <p-checkbox binary="true" class="form-control" [formControlName]="info.valueField"
                    [(ngModel)]="dataItem[info.valueField]"
                    [required]="info.required"
                    [style.color]="getColor(dataItem, info)">
        </p-checkbox>
      </div>

      <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
        {{ getFormErrors(info.valueField) }}
      </div>

    </div>
  </div>

  <!--
  Datumsfelder
  -->
  <div *ngIf="info.controlType === controlType.Date">
    <div class="form-group" *ngIf="! isHidden(info, dataItem)">
      <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

      <div class="col-sm-10">
        <p-calendar inputStyleClass="form-control" [formControlName]="info.valueField"
                    [(ngModel)]="dataItem[info.valueField]"
                    [required]="info.required" [readonlyInput]="isReadonly(info)"
                    dateFormat="yy-mm-dd" [style.color]="getColor(dataItem, info)">
        </p-calendar>
      </div>

      <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
        {{ getFormErrors(info.valueField) }}
      </div>

    </div>
  </div>

  <!--
  Zeitfelder:
  -->
  <div *ngIf="info.controlType === controlType.Time">
    <div class="form-group" *ngIf="! isHidden(info, dataItem)">
      <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

      <div class="col-sm-10">
        <flx-time-selector inputStyleClass="form-control"
                            [formControlName]="info.valueField"
                            [(ngModel)]="dataItem[info.valueField]"
                            [required]="info.required" [readonly]="isReadonly(info)"
                            [style.color]="getColor(dataItem, info)">
        </flx-time-selector>
      </div>

      <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
        {{ getFormErrors(info.valueField) }}
      </div>

    </div>
  </div>


  <!--
  Dropdown/Wertelisten:
  -->
  <div *ngIf="info.controlType === controlType.DropdownSelector">
    <div class="form-group" *ngIf="! isHidden(info, dataItem)">
      <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

      <div class="col-sm-10">
        <flx-dropdown-selector inputStyleClass="form-control"
                                [formControlName]="info.valueField"
                                [(ngModel)]="dataItem[info.valueField]"
                                [required]="info.required" [readonly]="isReadonly(info)"
                                [dataServiceRequests]="info.enumInfo.selectorDataServiceRequests"
                                [textField]="info.enumInfo.textField"
                                [valueField]="info.enumInfo.valueField"
                                [style]="{'width':'100%'}"
                                [style.color]="getColor(dataItem, info)"
                                [debug]="false">
        </flx-dropdown-selector>
      </div>

      <div *ngIf="getFormErrors(info.valueField)" class="alert alert-danger">
        {{ getFormErrors(info.valueField) }}
      </div>

    </div>
  </div>
</div>
`,
  styles: []
})
export class AutoformControlsComponent extends CoreComponent {
  protected static logger = getLogger(AutoformControlsComponent);

  /**
   * ControlType Werte
   */
  public controlType = ControlType;

  @Input() public formGroup: FormGroup;
  @Input() public info: IControlDisplayInfo;
  @Input() public dataItem: any;
  @Input() public action: FormAction;

  private parent: IAutoform;


  constructor(messageService: MessageService) {
    super(messageService);
  }

  public setParent(parent: IAutoform) {
    this.parent = parent;
  }


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

    // TODO
    // Feld aber nicht anzeigen, falls in hiddenFileds angegeben
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
  public isReadonly(info: IControlDisplayInfo): boolean {
    if (!this.parent) {
      return true;
    }

    return this.parent.isReadonly(info);
  }

  public getColor(data: any, info: IControlDisplayInfo): string {
    if (!this.parent) {
      return undefined;
    }

    return this.parent.getColor(data, info);
  }



  /**
   * Liefert den Typ eines html-input Fields für die angegebene Info @see{info}
   *
   * @param {IControlDisplayInfo} info
   * @returns {string}
   */
  public getInputType(info: IControlDisplayInfo): string {
    if (!this.parent) {
      return undefined;
    }
    return this.parent.getInputType(info);
  }

  public getFormErrors(controlName: string, groupName: string = FormGroupInfo.DEFAULT_NAME): string {
    if (!this.parent) {
      return undefined;
    }
    return this.parent.getFormErrors(controlName);
  }


}