// tslint:disable:max-line-length

import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/primeng';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { Assert, ColumnMetadata, TableMetadata } from '@fluxgate/common';

import { BaseComponent } from '../../common/base';
import { MetadataService, ProxyService } from '../../services';
import { MessageService } from '../../services/message.service';
import { IAutoformConfig } from './autoformConfig.interface';


@Component({
  selector: 'flx-autoform-detail',
  template: `
  <p-dialog [(visible)]="value" header="Overtime Details" (onBeforeHide)="onBeforeDialogHide($event)" [responsive]="true" showEffect="fade" [modal]="true">
  <div class="container-fluid">
  <form *ngIf="value" class="form-horizontal">
    <p-messages [value]="messages"></p-messages>

    <div>
      <ul *ngFor="let metadata of columnMetadata">

        <div class="form-group" *ngIf="! isHidden(metadata, value) && metadata.propertyType === 'string'">
          <label class="control-label col-sm-2">{{displayName(metadata)}}:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>
        </div>
        <div class="form-group" *ngIf="! isHidden(metadata, value) && metadata.propertyType === 'number'">
          <label class="control-label col-sm-2">{{displayName(metadata)}}:</label>
          <div class="col-sm-1">
            <input type="text" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>
        </div>

        <div class="form-group" *ngIf="! isHidden(metadata, value) && metadata.propertyType === 'shorttime'">
          <label class="control-label col-sm-2">{{displayName(metadata)}}:</label>
          <div class="col-sm-1">
            <input type="text" maxlength="5" size="6" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>
        </div>
        
        <div class="form-group" *ngIf="! isHidden(metadata, value) && metadata.propertyType === 'datetime'">
          <label class="control-label col-sm-2">{{displayName(metadata)}}:</label>
          <div class="col-sm-2">
            <input type="text" maxlength="10" size="10" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>
        </div>

        <!--<div class="form-group" *ngIf="info.typeInfo.dataType == enumEnum && info.isVisible">
          <label class="control-label col-sm-2">{{info.name}}:</label>
          <div class="col-sm-10">
          <select type="text" class="form-control">
            <option *ngFor="let o of info.typeInfo.options" [value]="o">{{o.name}}</option>
          </select>
          </div>
        </div>-->

      </ul>
    </div>
   <p-footer>
    <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
    <div class="container">
      <button type="submit" class="btn btn-primary" (click)='cancel()'>Abbruch</button>
      <button type="submit" class="btn btn-primary" (click)='submit()'>
      <span class="glyphicon glyphicon-save"></span> Speichern
    </button>
      <button type="submit" class="btn btn-primary" (click)='confirm()'>    
      <span class="glyphicon glyphicon-trash"></span> Löschen
    </button>
      <flx-popup (onAnswer)="delete($event)" [title]="'Löschen?'" [message]="'Soll wirklich gelöscht werden?'" *ngIf="askuser">Löschbestätigung</flx-popup>

    </div>
    </div>
    </p-footer>
  </form>
</div>
</p-dialog>
  `,
  styles: [],
  providers: [ConfirmationService]
})
export class AutoformDetailComponent extends BaseComponent<ProxyService> {
  protected static readonly logger = getLogger(AutoformDetailComponent);

  public static DETAILS = 'Details';

  public pageTitle: string = AutoformDetailComponent.DETAILS;


  /**
   * angebundenes Objekt.
   * 
   * @type {*}
   * @memberOf AutoformDetailComponent
   */
  @Input() public value: any;


  /**
   * Name der Klasse des angebundenen Objekts (z.B. 'Artikel') 
   * 
   * @type {string}
   * @memberOf AutoformDetailComponent
   */
  @Input() public entityName: string = '';


  /**
   * Konfiguration der Formularfelder
   * 
   * @type {IAutoformConfig}
   * @memberOf AutoformDetailComponent
   */
  @Input() public config: IAutoformConfig;


  /**
   * Meldung, wenn Fenster geschlossen wird
   * 
   * @type {EventEmitter}
   * @memberOf AutoformDetailComponent
   */
  @Output() private hide = new EventEmitter<any>();


  /**
   * Metainformation für alle Modelspalten (-> entityName)
   * 
   * @type {ColumnMetadata[]}
   * @memberOf AutoformDetailComponent
   */
  public columnMetadata: ColumnMetadata[];

  public askuser: boolean;


  constructor(router: Router, route: ActivatedRoute, messageService: MessageService, service: ProxyService, private injector: Injector,
    private confirmationService: ConfirmationService, private metadataService: MetadataService) {
    super(router, route, messageService, service);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();

    this.setupProxy(this.entityName);
  }

  public confirm() {
    using(new XLog(AutoformDetailComponent.logger, levels.INFO, 'confirm'), (log) => {
      this.confirmationService.confirm({
        header: 'Löschen',
        message: 'Soll wirklich gelöscht werden?',
        accept: () => {
          log.log('Löschen');
          this.delete(true);
        },
        reject: () => {
          log.log('Abbruch');
        }
      });
    });
  }



  public onBeforeDialogHide() {
    this.hide.emit(true);
  }



  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public cancel(): void {
    //this.navigate([this.service.getTopicPath()]);
    //this.hide.emit(true);

    this.value = false;
  }

  /**
   * Speichert Änderungen an der Entity
   */
  public submit() {
    const me = this;
    this.registerSubscription(this.service.update(this.value).subscribe(
      (value: any) => {
        this.value = value;
        me.cancel();
      },
      (error: Error) => {
        this.handleError(error);
      }));
  }

  /**
   * Löscht die Entity
   */
  public delete(event: boolean) {
    if (event === true) {
      const me = this;
      this.registerSubscription(this.service.delete(this.service.getEntityId(this.value)).subscribe(
        (value: any) => {
          this.value = value;
          me.cancel();
        },
        (error: Error) => {
          this.handleError(error);
        }));
    }
    this.askuser = false;
  }


  public showmodal() {
    this.askuser = true;
  }


  /**
   * Liefert den Anzeigenamen für das Feld zu @param{metadata}.
   */
  public displayName(metadata: ColumnMetadata): string {
    let displayName = metadata.propertyName;
    if (metadata.options.displayName) {
      displayName = metadata.options.displayName;
    }

    if (this.config) {
      const columnConfig = this.config.fields[metadata.propertyName];
      if (columnConfig) {
        displayName = columnConfig.displayName;
      }
    }

    return displayName;
  }

  /**
   * Liefert true, falls Feld zu @param{metadata} nicht anzuzeigen ist
   */
  public isHidden(metadata: ColumnMetadata, value: any): boolean {
    // Default: Anzeige, falls displayName im Model gesetzt ist
    let rval = metadata.options.displayName === undefined;

    // sonst steuert die Konfiguration, ob das Feld angezeigt oder verborgen werden soll 
    if (this.config) {
      // Wert aus Konfig überschreibt Model-Konfig
      if (this.config.fields && this.config.fields[metadata.propertyName]) {
        rval = false;
      }

      // Feld aber nicht anzeigen, falls in hiddenFileds angegeben
      if (this.config.hiddenFields && this.config.hiddenFields.indexOf(metadata.propertyName) >= 0) {
        rval = true;
      }
    }
    return rval || value === undefined || value[metadata.propertyName] === undefined;
  }


  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und 
   * den ProxyService damit initialisieren
   */
  private setupProxy(entityName: string) {
    using(new XLog(AutoformDetailComponent.logger, levels.INFO, 'setupProxy', `entityName = ${entityName}`), (log) => {
      const tableMetadata: TableMetadata = this.metadataService.findTableMetadata(entityName);

      Assert.notNull(tableMetadata, `No metadata for entity ${entityName}`);

      log.log(`table = ${tableMetadata.options.name}`);
      this.columnMetadata = tableMetadata.columnMetadata;

      const service = tableMetadata.getServiceInstance(this.injector);
      this.service.proxyService(service);
    });
  }


}