// tslint:disable:max-line-length

import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  APP_STORE,
  AutoformConfiguration, ControlType, DataFormAction, FormAction, FormActions, IAutoformConfig,
  IControlDisplayInfo, IDataFormAction, MessageService, MetadataService, ServiceRequestsComponent
} from '@fluxgate/client';
import {
  ICrudServiceRequests, ItemCreatedCommand, ItemDeletedCommand, ItemUpdatedCommand, ServiceCommand, Store, TableMetadata
} from '@fluxgate/common';
import { Assert, Clone, Color, Core, NotSupportedException, Types, Utility } from '@fluxgate/core';


@Component({
  selector: 'flx-autoform',
  template: `
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
              <input flxAutofocus [type]="getInputType(info)" class="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
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
        Checkbox-Controls für boolean Werte
        -->
        <div *ngIf="info.controlType === controlType.Checkbox">
          <div class="form-group" *ngIf="! isHidden(info, dataItem)">
            <label class="control-label col-sm-2" [for]="info.valueField">{{info.textField}}</label>

            <div class="col-sm-10">
              <p-checkbox binary="true" class="form-control" [formControlName]="info.valueField" [(ngModel)]="dataItem[info.valueField]"
                [required]="info.required"
                [style.color]="getColor(dataItem, info)" >
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

    <p-footer *ngIf="showButtons">
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
          <button type="button" class="btn btn-primary" (click)='cancel()'>Cancel</button>
          <button type="button" class="btn btn-primary" [disabled]="isSaveDisabled()" (click)='submit()'>Save</button>
          <button type="button" class="btn btn-primary" (click)='confirmDelete()'>Delete</button>
      </div>
    </p-footer>
  </form>

  <flx-confirmation-dialog></flx-confirmation-dialog>
</div>
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
   * Die durchzuführende Aktion (creae, edit, etc.)
   *
   * @private
   * @type {FormAction}
   * @memberOf AutoformComponent
   */
  @Input() public action: FormAction;

  @Input() public inputTest: string;


  @Input() public showButtons: boolean = false;
  @Input() public skipNgOnInit: boolean = false;

  @Output() public cancelChange = new EventEmitter<any>();
  @Output() public closeChange = new EventEmitter<any>();


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


  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService, private injector: Injector,
    private metadataService: MetadataService, private cdr: ChangeDetectorRef) {
    super(router, route, messageService, null);

    using(new XLog(AutoformComponent.logger, levels.INFO, 'ctor'), (log) => {
      this.route.params.subscribe((p) => {
        log.log(`params = ${Core.stringify(p)}`);
      });
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'ctor'), (log) => {
      super.ngOnInit();

      if (!this.skipNgOnInit) {

        this.route.data.subscribe((formAction: IDataFormAction) => {
          log.log(`data = ${Core.stringify(formAction)}`);

          Assert.notNull(formAction);

          if (Utility.isNullOrEmpty(formAction.action) || Utility.isNullOrEmpty(formAction.resolverKey)) {
            if (Utility.isNullOrEmpty(formAction.action)) {
              log.warn(`data.action is empty`);
            }
            if (Utility.isNullOrEmpty(formAction.resolverKey)) {
              log.warn(`data.resolverKey is empty`);
            }

          } else {
            Assert.notNullOrEmpty(formAction.action);
            Assert.notNullOrEmpty(formAction.resolverKey);

            this.action = formAction.action;
            this.showButtons = formAction.showButtons;

            const value = DataFormAction.getData(formAction);
            Assert.notNull(value);

            this.value = value;

            this.initForm(this.value);
            this.cdr.detectChanges();
          }
        });
      } else {
        this.initForm(this.value);
      }
    });
  }


  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public cancel(): void {
    this.onCancelChange();
  }


  /**
   * Speichert Änderungen an der Entity
   */
  public submit() {
    if (this.action === FormActions.UPDATE) {
      this.registerSubscription(this.serviceRequests.update(this.value).subscribe(
        (value: any) => {
          // -> onStoreUpdated
        }));
    } else if (this.action === FormActions.CREATE) {
      this.registerSubscription(this.serviceRequests.create(this.value).subscribe(
        (value: any) => {
          // -> onStoreUpdated
        }));
    } else {
      throw new NotSupportedException(`invalid action: ${this.action}`);
    }
  }


  public confirmDelete() {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'confirmDelete'), (log) => {

      if (confirm('Do you want to delete this record?')) {
        this.deleteItem(this.value);
      }

      // this.confirmAction({
      //   header: 'Delete',
      //   message: 'Do you want to delete this record?'
      // }, () => this.delete());
    });
  }


  public isSaveDisabled(): boolean {
    return !(this.hasChanges() && this.isValid());
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


  public getInputType(info: IControlDisplayInfo): string {
    if (info.isSecret) {
      return 'password';
    } else {
      return 'text';
    }
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



  protected onStoreUpdated<T>(command: ServiceCommand<T>): void {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'onStoreUpdated'), (log) => {
      super.onStoreUpdated(command);

      const state = super.getStoreState(command.storeId);
      if (state.error) {
        this.onCloseChange(true);
      } else {
        if (command instanceof ItemCreatedCommand || command instanceof ItemDeletedCommand || command instanceof ItemUpdatedCommand) {
          this.resetFormGroup(this.value);
          this.onCloseChange(false);
        }
      }
    });
  }


  /**
   *
   *
   * @protected
   * @param {boolean} formResetRequired
   * @memberof AutoformComponent
   */
  protected onCloseChange(formResetRequired: boolean) {
    this.closeChange.emit(formResetRequired);
  }


  /**
   *
   *
   * @protected
   * @memberof AutoformComponent
   */
  protected onCancelChange() {
    this.cancelChange.emit();
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
        log.log(`item = ${Core.stringify(item)},` +
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
        log.log(`configInternal : ${Core.stringify(this.configInternal)}`);
      }

    });
  }

  private initForm(value: any) {
    Assert.notNull(value);
    Assert.notNull(value.constructor);
    const entityName = value.constructor.name;

    this.setupProxy(entityName);

    // FormBuilder erzeugen
    this.buildForm(this.fb, this.value, this.configInternal.columnInfos, this.metadataService.findTableMetadata(entityName));
  }

}