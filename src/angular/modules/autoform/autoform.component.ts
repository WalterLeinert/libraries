// tslint:disable:max-line-length

import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert, Clone, Color, NotSupportedException, TableMetadata, Utility } from '@fluxgate/common';

import { IControlDisplayInfo } from '../../../base';
import { BaseComponent } from '../../common/base';
import { MetadataService, ProxyService } from '../../services';
import { MessageService } from '../../services/message.service';
import { ControlType } from '../common';
import { IAutoformConfig } from './autoformConfig.interface';
import { AutoformConfiguration } from './autoformConfiguration';
import { FormAction, FormActions, IDataFormAction } from './form-action';


@Component({
  selector: 'flx-autoform',
  template: `
<p-dialog [(visible)]="dataItem" [header]="pageTitle" (onBeforeHide)="onBeforeDialogHide($event)" [responsive]="true" showEffect="fade"
  [modal]="true">
  <div class="container-fluid">
    <form *ngIf="dataItem" class="form-horizontal" [formGroup]="form">

      <div *ngIf="configInternal && configInternal.columnInfos">
        <ul *ngFor="let info of configInternal.columnInfos">

          <!--
          normale Text-/Eingabefelder
          -->
          <div *ngIf="info.controlType === controlType.Input">
            <div class="form-group" *ngIf="! isHidden(info, dataItem)">
              <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

              <div class="col-sm-6">
                <input type="text" class="form-control" [(ngModel)]="dataItem[info.valueField]" 
                  [id]="info.valueField" [formControlName]="info.valueField"
                  [readonly]="isReadonly(info)"
                  [style.color]="getColor(dataItem, info)"
                >
              </div>

              <div *ngIf="formErrors[info.valueField]" class="alert alert-danger">
                {{ formErrors[info.valueField] }}
              </div>           
              
            </div>
          </div>

          <!--
          Datumsfelder
          -->
          <div *ngIf="info.controlType === controlType.Date">
            <div class="form-group" *ngIf="! isHidden(info, dataItem)">
              <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

              <div class="col-sm-6">
                <p-calendar class="form-control" [(ngModel)]="dataItem[info.valueField]" 
                  [id]="info.valueField" [formControlName]="info.valueField"
                  [readonlyInput]="isReadonly(info)"
                  dateFormat="yy-mm-dd" [style.color]="getColor(dataItem, info)">
                </p-calendar>
              </div>

              <div *ngIf="formErrors[info.valueField]" class="alert alert-danger">
                {{ formErrors[info.valueField] }}
              </div>           

            </div>
          </div>

          <!--
          Zeitfelder: Achtung: noch keine Formvalidierung (formControlName funktioniert noch nicht)
          -->
          <div *ngIf="info.controlType === controlType.Time">
            <div class="form-group" *ngIf="! isHidden(info, dataItem)">
              <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

              <div class="col-sm-6">
                <flx-time-selector class="form-control" [(time)]="dataItem[info.valueField]"
                  [id]="info.valueField"
                  [readonly]="isReadonly(info)"
                  [style.color]="getColor(dataItem, info)">
                </flx-time-selector>
              </div>

              <div *ngIf="formErrors[info.valueField]" class="alert alert-danger">
                {{ formErrors[info.valueField] }}
              </div>           

            </div>
          </div>


          <!--
          Dropdown/Wertelisten: Achtung: noch keine Formvalidierung (formControlName funktioniert noch nicht)
          -->
          <div *ngIf="info.controlType === controlType.DropdownSelector">
            <div class="form-group" *ngIf="! isHidden(info, dataItem)">
              <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

              <div class="col-sm-6">
                <flx-dropdown-selector class="form-control" [dataService]="info.enumInfo.selectorDataService"
                  [id]="info.valueField"
                  [readonly]="isReadonly(info)"
                  [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
                  [(selectedValue)]="dataItem[info.valueField]" [style]="{'width':'100%'}" 
                  [style.color]="getColor(dataItem, info)"
                  [debug]="false">
                </flx-dropdown-selector>
              </div>

              <div *ngIf="formErrors[info.valueField]" class="alert alert-danger">
                {{ formErrors[info.valueField] }}
              </div>           
              
            </div>
          </div>      

        </ul>
      </div>

      <p-footer>
        <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
          <div class="container">
            <button type="submit" class="btn btn-primary" (click)='cancel()'>Cancel</button>
            <button type="submit" class="btn btn-primary" (click)='submit()'>
              <span class="glyphicon glyphicon-save"></span>Save
            </button>
            <button type="submit" class="btn btn-primary" (click)='confirmDelete()'>    
              <span class="glyphicon glyphicon-trash"></span>Delete
            </button>

            <flx-confirmation-dialog></flx-confirmation-dialog>

          </div>
        </div>
      </p-footer>
    </form>
  </div>
</p-dialog>
`,
  styles: [`
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* green */
}

.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* red */
}
`]
})
export class AutoformComponent extends BaseComponent<ProxyService> {
  protected static readonly logger = getLogger(AutoformComponent);

  public static DETAILS = 'Details';

  public pageTitle: string = AutoformComponent.DETAILS;


  /**
   * ControlType Werte
   */
  public controlType = ControlType;

  // >> Value Property
  /**
   * (von aussen) angebundenes Objekt.
   * 
   * @type {*}
   */
  private _value: any;

  /**
   * dataChange Event: wird bei jeder SelektionÄänderung von data gefeuert.
   *
   * Eventdaten: @type{any} - selektiertes Objekt.
   */
  @Output() public valueChange = new EventEmitter<any>();
  // << Value Property


  /**
   * Name der Klasse des angebundenen Objekts (z.B. 'Artikel') 
   * 
   * @type {string}
   */
  @Input() public entityName: string = '';


  // >> Konfiguration

  /**
   * erzeugt eine Instanz von @see{IAutoformConfig}
   * 
   * @private
   * @type {AutoformConfiguration}
   */
  private configurator: AutoformConfiguration;

  /**
   * 
   * 
   * @private
   * @type {IAutoformConfig}
   * @memberOf AutoformComponent
   */
  private _config: IAutoformConfig;

  public configInternal: IAutoformConfig;
  // << Konfiguration


  /**
   * die (intern) angebundene Modelinstanz
   * 
   * @type {*}
   * @memberOf AutoformComponent
   */
  public dataItem: any;

  /**
   * Die durchzuführende Aktion (creae, edit, etc.)
   * 
   * @private
   * @type {FormAction}
   * @memberOf AutoformComponent
   */
  private action: FormAction;


  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService, service: ProxyService, private injector: Injector,
    private metadataService: MetadataService) {
    super(router, route, messageService, service);

    using(new XLog(AutoformComponent.logger, levels.INFO, 'ctor'), (log) => {
      this.route.params.subscribe((p) => {
        log.log(`params = ${JSON.stringify(p)}`);
      });
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'ctor'), (log) => {
      super.ngOnInit();

      this.route.data.subscribe((data: IDataFormAction) => {
        log.log(`data = ${JSON.stringify(data)}`);

        Assert.notNull(data);

        if (Utility.isNullOrEmpty(data.action) || Utility.isNullOrEmpty(data.resolverKey)) {
          if (Utility.isNullOrEmpty(data.action)) {
            log.warn(`data.action is empty`);
          }
          if (Utility.isNullOrEmpty(data.resolverKey)) {
            log.warn(`data.resolverKey is empty`);
          }

        } else {
          Assert.notNullOrEmpty(data.action);
          Assert.notNullOrEmpty(data.resolverKey);

          this.action = data.action;

          const value = data[data.resolverKey];
          Assert.notNull(value);

          this.value = value;

          Assert.notNull(value.constructor);
          this.entityName = value.constructor.name;

          this.setupProxy(this.entityName);

          // FormBuilder erzeugen
          this.buildForm(this.fb, this.value, this.configInternal.columnInfos);
        }
      });
    });
  }


  /**
   * Handler für das Schliessen über ESC oder close-icon
   */
  public onBeforeDialogHide() {
    this.closePopup(true);
  }


  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public cancel(): void {
    this.closePopup(true);
  }

  /**
   * Speichert Änderungen an der Entity
   */
  public submit() {
    if (this.action === FormActions.UPDATE) {
      this.registerSubscription(this.service.update(this.value).subscribe(
        (value: any) => {
          this.resetForm(this.value);
          this.addSuccessMessage(`Record updated.`);
          this.closePopup(false);
        },
        (error: Error) => {
          this.handleError(error);
        }));
    } else if (this.action === FormActions.CREATE) {
      this.registerSubscription(this.service.create(this.value).subscribe(
        (value: any) => {
          this.resetForm(this.value);
          this.addSuccessMessage(`Record created.`);
          this.closePopup(false);
        },
        (error: Error) => {
          this.handleError(error);
        }));
    } else {
      throw new NotSupportedException(`invalid action: ${this.action}`);
    }
  }


  /**
   * Löscht die Entity
   */
  public delete() {
    this.registerSubscription(this.service.delete(this.service.getEntityId(this.value)).subscribe(
      (value: any) => {
        this.resetForm(this.value);
        this.addSuccessMessage(`Record deleted.`);
        this.closePopup(false);
      },
      (error: Error) => {
        this.handleError(error);
      }));
  }


  public confirmDelete() {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'confirmDelete'), (log) => {
      this.confirmAction({
        header: 'Delete',
        message: 'Do you want to delete this record?'
      }, () => this.delete());
    });
  }


  /**
   * Liefert true, falls Feld zu @param{metadata} nicht anzuzeigen ist
   */
  public isHidden(info: IControlDisplayInfo, value: any): boolean {
    // Default: Anzeige, falls displayName im Model gesetzt ist
    let rval = info.textField === undefined;

    // Feld aber nicht anzeigen, falls in hiddenFileds angegeben
    if (this.configInternal.hiddenFields && this.configInternal.hiddenFields.indexOf(info.valueField) >= 0) {
      rval = true;
    }

    return rval || value === undefined || value[info.valueField] === undefined;
  }

  /**
   * Liefert true, falls die Daten nicht änderbar sind
   * 
   * @param {IControlDisplayInfo} info 
   * @returns 
   * 
   * @memberOf AutoformComponent
   */
  public isReadonly(info: IControlDisplayInfo): boolean {
    return !info.editable || this.action === FormActions.VIEW;
  }

  public getColor(data: any, info: IControlDisplayInfo): string {
    Assert.notNull(data);
    Assert.notNull(info);

    if (info.color !== undefined) {
      if (info.color instanceof Color) {
        return info.color.toString();
      } else {
        return info.color(data).toString();
      }
    }
    return undefined;
  }



  // -------------------------------------------------------------------------------------
  // Property config
  // -------------------------------------------------------------------------------------
  public get config(): IAutoformConfig {
    return this._config;
  }

  @Input() public set config(config: IAutoformConfig) {
    this._config = config;
    this.initBoundData(this.dataItem, this.getMetadataForValue(this.value));
  }


  // -------------------------------------------------------------------------------------
  // Property value und der Change Event
  // -------------------------------------------------------------------------------------
  protected onValueChange(value: any) {
    this.valueChange.emit(value);

    //
    // wir prüfen, ob für Items (nur das erste Element) Metadaten vorliegen ->
    // ggf. autom. Konfiguration über Metadaten
    //
    this.initBoundData(value, this.getMetadataForValue(value));
  }

  public get value(): any {
    return this._value;
  }

  @Input() public set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.onValueChange(value);
    }
  }


  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und 
   * den ProxyService damit initialisieren
   */
  private setupProxy(entityName: string) {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'setupProxy', `entityName = ${entityName}`), (log) => {
      const tableMetadata: TableMetadata = this.metadataService.findTableMetadata(entityName);

      Assert.notNull(tableMetadata, `No metadata for entity ${entityName}`);

      log.log(`table = ${tableMetadata.options.name}`);

      const service = tableMetadata.getServiceInstance(this.injector);
      this.service.proxyService(service);
    });
  }


  private closePopup(cancelled: boolean) {
    if (this.hasChanges()) {
      if (confirm('You have unsaved changes: OK to discard?')) {
        this.doClose(cancelled);
      }

      // TODO: auf confirmAction umstellen
      // this.confirmAction({
      //   header: 'Unsaved Changes',
      //   message: 'You have unsaved changes: OK to discard?'
      // }, () =>
      //     this.doClose(cancelled)
      // );
    } else {
      this.doClose(cancelled);
    }
  }


  private doClose(cancelled: boolean) {
    let navigationPath: string;

    switch (this.action) {
      // die Navigation für create hat keine Id im Pfad (.../create)
      case FormActions.CREATE:
        navigationPath = '..';
        break;

      case FormActions.UPDATE:
        // die Navigation für update hat eine Id im Pfad (.../update/:id)
        navigationPath = '../..';
        break;

      default:
        throw new NotSupportedException(`unsupported action ${this.action}`);
    }

    this.navigate([navigationPath, { refresh: !cancelled }], { relativeTo: this.route });
  }



  /**
   * Liefert @see{TableMetadata}, falls für die @param{values} (nur das erste Element) Metadaten vorliegen ->
   * ggf. autom. Konfiguration über Metadaten
   */
  private getMetadataForValue(value: any): TableMetadata {
    let tableMetadata;
    if (value !== undefined) {

      if (value.constructor) {
        const clazzName = value.constructor.name;
        tableMetadata = this.metadataService.findTableMetadata(clazzName);
      }
    }
    return tableMetadata;
  }




  private initBoundData(item: any, tableMetadata: TableMetadata) {
    this.setupConfig(item, tableMetadata);
    this.setupData(item);
  }

  private setupData(item: any) {
    this.dataItem = item;
  }


  private setupConfig(item: any, tableMetadata: TableMetadata): void {
    using(new XLog(AutoformComponent.logger, levels.DEBUG, 'setupConfig'), (log) => {
      if (log.isDebugEnabled) {
        log.log(`item = ${JSON.stringify(item)},` +
          ` tableMetadata = ${tableMetadata ? tableMetadata.className : 'undefined'}`);
      }

      if (this.config === undefined && tableMetadata === undefined) {
        return;
      }

      this.configurator = new AutoformConfiguration(tableMetadata, this.metadataService, this.injector);

      if (this.config) {
        this.configInternal = Clone.clone(this.config);

        this.configurator.configureConfig(this.configInternal);
      } else {
        this.configInternal = this.configurator.createConfig(this.config);
      }

      if (log.isDebugEnabled()) {
        log.log(`configInternal : ${JSON.stringify(this.configInternal)}`);
      }

    });
  }

}