// tslint:disable:max-line-length

import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  APP_STORE,
  AutoformConfiguration, ControlType, FormAction, FormActions, IAutoformConfig,
  IControlDisplayInfo, IDataFormAction, MessageService, MetadataService, ServiceRequestsComponent
} from '@fluxgate/client';
import { ICrudServiceRequests, IService, ServiceProxy, Store, TableMetadata } from '@fluxgate/common';
import { Assert, Clone, Color, NotSupportedException, Utility } from '@fluxgate/core';


@Component({
  selector: 'flx-autoform',
  template: `
<p-dialog [(visible)]="dataItem" [header]="pageTitle" (onHide)="onBeforeDialogHide($event)" [responsive]="true" showEffect="fade"
  [modal]="true" width="600">
  <div class="container-fluid">
    <form *ngIf="dataItem" class="form-horizontal" [formGroup]="getForm()">

      <div *ngIf="configInternal && configInternal.columnInfos">
        <ul *ngFor="let info of configInternal.columnInfos">

          <!--
          normale Text-/Eingabefelder
          -->
          <div *ngIf="info.controlType === controlType.Input">
            <div class="form-group" *ngIf="! isHidden(info, dataItem)">
              <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

              <div class="col-sm-10">
                <input flxAutofocus type="text" class="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
                  [required]="info.required" [readonly]="isReadonly(info)"
                  [style.color]="getColor(dataItem, info)"
                >
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
                <p-calendar inputStyleClass="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
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
                <flx-time-selector inputStyleClass="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
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
                <flx-dropdown-selector inputStyleClass="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
                  [required]="info.required" [readonly]="isReadonly(info)"
                  [dataServiceRequests]="info.enumInfo.selectorDataServiceRequests"
                  [textField]="info.enumInfo.textField" [valueField]="info.enumInfo.valueField"
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

        </ul>
      </div>

      <p-footer>
        <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
            <button type="button" class="btn btn-primary" (click)='cancel()'>Cancel</button>
            <button type="button" class="btn btn-primary" [disabled]="isSaveDisabled()" (click)='submit()'>Save</button>
            <button type="button" class="btn btn-primary" (click)='confirmDelete()'>Delete</button>
        </div>
      </p-footer>
    </form>
  </div>
  <flx-confirmation-dialog></flx-confirmation-dialog>
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
export class AutoformComponent extends ServiceRequestsComponent<any, ICrudServiceRequests<any, any>> {
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


  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService, private injector: Injector,
    private metadataService: MetadataService) {
    super(router, route, messageService, null);

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
          this.buildForm(this.fb, this.value, this.configInternal.columnInfos, this.metadataService.findTableMetadata(this.entityName));
        }
      });
    });
  }


  /**
   * Handler für das Schliessen über ESC oder close-icon
   */
  public onBeforeDialogHide() {
    this.closePopup();
  }


  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public cancel(): void {
    this.closePopup();
  }


  /**
   * Speichert Änderungen an der Entity
   */
  public submit() {
    if (this.action === FormActions.UPDATE) {
      this.registerSubscription(this.serviceRequests.update(this.value).subscribe(
        (value: any) => {
          this.resetFormGroup(this.value);
          this.doClose(false);
        },
        (error: Error) => {
          this.handleError(error);
        }));
    } else if (this.action === FormActions.CREATE) {
      this.registerSubscription(this.serviceRequests.create(this.value).subscribe(
        (value: any) => {
          this.resetFormGroup(this.value);
          this.doClose(false);
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
    this.registerSubscription(this.serviceRequests.delete(this.serviceRequests.getEntityId(this.value)).subscribe(
      (value: any) => {
        this.resetFormGroup(this.value);
        this.doClose(false);
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

  public isSaveDisabled(): boolean {
    return !(this.hasChanges() && this.isValid());
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

      const store = this.injector.get(APP_STORE) as Store;
      const serviceRequests = tableMetadata.getServiceRequestsInstance(this.injector, store);
      this.setServiceRequests(serviceRequests);
    });
  }


  /**
   * Schliesst Autoform, falls keine ungespeicherten Änderungen vorliegen bzw. das Schliessen bestätigt wurde.
   *
   * @private
   *
   * @memberof AutoformComponent
   */
  private closePopup() {
    if (this.hasChanges()) {

      if (confirm('You have unsaved changes: OK to discard?')) {
        this.doClose(true);
      }

      // this.confirmAction({
      //   header: 'Unsaved Changes',
      //   message: 'You have unsaved changes: OK to discard?'
      // }, () =>
      //     this.doClose(true)
      // );
    } else {
      this.doClose(false);
    }
  }


  /**
   * Schliesst Autoform, indem auf die vorherige Seite navigiert wird.
   *
   * @private
   * @param {boolean} formResetRequired - falls true, wird ein resetFormGroup durchgeführt,
   * damit nicht ein GuardService die Navigation verhindert.
   *
   * @memberof AutoformComponent
   */
  private doClose(formResetRequired: boolean) {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'doClose', `formResetRequired = ${formResetRequired}, action = ${this.action}`), (log) => {
      let navigationPath: string;

      if (formResetRequired) {
        // weitere Abfragen unterdrücken
        this.resetFormGroup(this.value);
      }

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

      this.navigate([navigationPath, { refresh: !formResetRequired }], { relativeTo: this.route });
    });
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