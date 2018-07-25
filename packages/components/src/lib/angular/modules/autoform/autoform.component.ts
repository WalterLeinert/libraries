// tslint:disable:max-line-length

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  APP_STORE, AutoformConfiguration, ControlType, DataFormAction, FormAction,
  FormActions, IAutoformConfig, IColumnGroupInfo, IControlDisplayInfo, IDataFormAction,
  MessageService, MetadataService, ServiceRequestsComponent
} from '@fluxgate/client';
import {
  ColumnGroupMetadata, ICrudServiceRequests, ItemCreatedCommand, ItemDeletedCommand,
  ItemUpdatedCommand, ServiceCommand, Store, TableMetadata
} from '@fluxgate/common';
import { Assert, Clone, Color, Core, Funktion, NotSupportedException, Types, Utility } from '@fluxgate/core';

import { AutoformControlsComponent } from './autoform-controls/autoform-controls.component';

@Component({
  selector: 'flx-autoform',
  template: `
<div class="container-fluid">
  <form *ngIf="dataItem" class="form-horizontal" [formGroup]="getForm()">

    <div *ngIf="configInternal && configInternal.groupInfos">
      <ul *ngFor="let groupInfo of configInternal.groupInfos">

        <div *ngIf="groupInfo.hidden">
          <ul *ngFor="let info of groupInfo.columnInfos">
                <flx-autoform-controls [formGroup]="getForm()" [info]="info" [dataItem]="dataItem" [action]="action">
                </flx-autoform-controls>
          </ul>
        </div>

        <p-fieldset *ngIf="!groupInfo.hidden" [legend]="groupInfo.name" [toggleable]="true">
            <ul *ngFor="let info of groupInfo.columnInfos">
              <flx-autoform-controls [formGroup]="getForm()" [info]="info" [dataItem]="dataItem" [action]="action">
              </flx-autoform-controls>
            </ul>
        </p-fieldset>

      </ul>
    </div>

    <p-footer *ngIf="showButtons">
      <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
        <button *ngIf="showNewButton" type="button" class="btn btn-primary" id="new" (click)='onCreateNew()'>
          New
        </button>

        <button type="button" class="btn btn-primary" id="cancel" (click)='onCancel()'>
          Cancel
        </button>

        <button type="button" class="btn btn-primary" id="save" [disabled]="isSaveDisabled()" (click)='onSubmit()'>
          Save
        </button>

        <button type="button" class="btn btn-primary" id="delete" [disabled]="isDeleteDisabled()" (click)='onDelete()'>
          Delete
        </button>
      </div>
    </p-footer>
  </form>

  <flx-confirmation-dialog></flx-confirmation-dialog>
</div>
`,
  styles: [`
.ng-valid[required], .ng-valid.required {
    border-left: 5px solid #42A948; /* green */
}

.ng-invalid:not(form) {
    border-left: 5px solid #a94442; /* red */
}
`]
})
export class AutoformComponent extends ServiceRequestsComponent<any, ICrudServiceRequests<any, any>> implements AfterViewInit {
  protected static readonly logger = getLogger(AutoformComponent);

  public static DETAILS = 'Details';

  @ViewChildren(AutoformControlsComponent) public controls: QueryList<AutoformControlsComponent>;


  /**
   * ControlType Werte
   */
  public controlType = ControlType;

  // >> Value Property
  /**
   * (von aussen) angebundenes Objekt.
   */
  private _value: any;

  /**
   * dataChange Event: wird bei jeder SelektionÄänderung von data gefeuert.
   *
   * Eventdaten: selektiertes Objekt.
   */
  @Output() public valueChange = new EventEmitter<any>();
  // << Value Property


  /**
   * Die durchzuführende Aktion (creae, edit, etc.)
   */
  @Input() public action: FormAction;

  @Input() public inputTest: string;


  @Input() public showButtons: boolean = false;
  @Input() public showNewButton: boolean = false;
  @Input() public skipNgOnInit: boolean = false;

  @Output() public cancel = new EventEmitter<any>();
  @Output() public close = new EventEmitter<any>();


  // >> Konfiguration

  /**
   * erzeugt eine Instanz von @see{IAutoformConfig}
   */
  private configurator: AutoformConfiguration;
  private _config: IAutoformConfig;

  public configInternal: IAutoformConfig;
  // << Konfiguration

  /**
   * die (intern) angebundene Modelinstanz
   */
  public dataItem: any;

  private tableMetadata: TableMetadata;

  /**
   * falls true, wurde über den New-Button eine neue leere Entity erzeugt,
   * die (normlerweise) später gespeichert wird
   */
  private creatingNew: boolean = false;

  /**
   * falls eine neue Entity angelegt werden soll, wird die bisherige Entity hier abgelegt
   */
  private clonedValue: any;


  /**
   *
   * @param fb
   * @param router
   * @param route
   * @param messageService
   * @param injector
   * @param metadataService
   * @param cdr
   */
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
            this.showNewButton = formAction.showNewButton;

            const value = DataFormAction.getData(formAction);
            Assert.notNull(value);

            this.value = value;
            this.initForm(this.value);
          }
        });
      } else {
        this.initForm(this.value);
      }
    });
  }

  public ngAfterViewInit() {
    this.controls.forEach((item) => {
      item.setParent(this);
    });
  }

  public onCreateNew<T>(): void {
    this.clonedValue = Clone.clone(this.value);
    this.value = this.tableMetadata.createEntity<T>();
    this.initForm(this.value);
    this.creatingNew = true;
  }


  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public onCancel(): void {
    if (this.creatingNew) {
      this.value = this.clonedValue;
      this.clonedValue = undefined;
      this.creatingNew = false;
    }
    this.initForm(this.value);

    this.doCancel();
  }


  /**
   * Speichert Änderungen an der Entity
   */
  public onSubmit() {
    if (this.action === FormActions.UPDATE && !this.creatingNew) {
      this.registerSubscription(this.serviceRequests.update(this.value).subscribe(
        (value: any) => {
          // -> onStoreUpdated
        }));
    } else if (this.action === FormActions.CREATE || this.creatingNew) {
      this.registerSubscription(this.serviceRequests.create(this.value).subscribe(
        (value: any) => {
          // -> onStoreUpdated
        }));
    } else {
      throw new NotSupportedException(`invalid action: ${this.action}`);
    }
  }


  public onDelete() {
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

  public isDeleteDisabled(): boolean {
    return this.creatingNew;
  }


  /**
   * Liefert true, falls Feld zu @param{metadata} nicht anzuzeigen ist
   *
   * @param info
   * @param value
   * @returns
   */
  public isHidden(info: IControlDisplayInfo, value: any): boolean {
    // Default: Anzeige, falls displayName im Model gesetzt ist
    let rval = info.textField === undefined;

    // Feld aber nicht anzeigen, falls in hiddenFileds angegeben
    if (this.configInternal.hiddenFields && this.configInternal.hiddenFields.indexOf(info.valueField) >= 0) {
      rval = true;
    }

    return rval;
  }


  /**
   * Liefert true, falls die Daten nicht änderbar sind
   *
   * @param info
   * @returns
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

  @Input()
  public set config(config: IAutoformConfig) {
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

  @Input()
  public set value(value: any) {
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
        this.doClose(true);
      } else {
        if (command instanceof ItemCreatedCommand || command instanceof ItemDeletedCommand || command instanceof ItemUpdatedCommand) {
          this.creatingNew = false;
          this.resetFormGroup(this.value);
          this.doClose(false);
        }
      }
    });
  }


  /**
   *
   * @param formResetRequired
   */
  private doClose(formResetRequired: boolean) {
    this.close.emit(formResetRequired);
  }


  private doCancel() {
    this.cancel.emit();
  }


  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und
   * den ProxyService damit initialisieren
   */
  private setupProxy(model: Funktion) {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'setupProxy', `model = ${model.name}`), (log) => {
      this.tableMetadata = this.metadataService.findTableMetadata(model);

      Assert.notNull(this.tableMetadata, `No metadata for entity ${model.name}`);

      log.log(`table = ${this.tableMetadata.options.name}`);

      const store = this.injector.get(APP_STORE) as Store;
      const serviceRequests = this.tableMetadata.getServiceRequestsInstance(this.injector, store);
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
        tableMetadata = this.metadataService.findTableMetadata(value.constructor);
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

        this.configInternal.groupInfos.forEach((gi) => {
          this.configurator.configureConfig(gi.columnInfos);
        });

      } else {
        const obj = tableMetadata.createEntity();
        const groupInfos: IColumnGroupInfo[] = [];

        tableMetadata.columnGroupMetadata.forEach((cgm) => {

          const displayInfos = this.createDisplayInfos(obj, tableMetadata.target, this.metadataService, cgm.columnNames);

          groupInfos.push({
            columnInfos: displayInfos,
            hidden: cgm.hidden,
            name: cgm.name,
            order: cgm.options.order
          });

        });
        this.configInternal = { groupInfos: groupInfos };
      }

      if (log.isDebugEnabled()) {
        log.debug(`configInternal : ${Core.stringify(this.configInternal)}`);
      }
    });
  }

  private initForm(value: any) {
    Assert.notNull(value);
    Assert.notNull(value.constructor);

    this.setupProxy(value.constructor);

    // FormBuilder erzeugen
    this.buildForm(this.fb, this.value, this.configInternal.groupInfos, this.metadataService.findTableMetadata(value.constructor));

    // erneut change detection triggern
    this.cdr.detectChanges();
  }

}