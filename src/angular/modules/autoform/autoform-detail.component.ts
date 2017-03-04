// tslint:disable:max-line-length

import { Component, Injector, Input } from '@angular/core';
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
import { IAutoformConfig } from './autoformConfig.interface';


@Component({
  selector: 'flx-autoform-detail',
  template: `
<div class="container-fluid">
  <!-- <h1>{{pageTitle}}</h1> -->
  <form *ngIf="value">
    <p-messages [value]="messages"></p-messages>

    <div>
      <ul *ngFor="let metadata of columnMetadata">

        <div class="form-group" *ngIf="! isHidden(metadata) && value[metadata.propertyName] && metadata.propertyType === 'string'">
          <label>{{displayName(metadata)}}</label>
          <input type="text" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
        </div>
        <div class="form-group" *ngIf="! isHidden(metadata) && value[metadata.propertyName] && metadata.propertyType === 'number'">
          <label>{{displayName(metadata)}}</label>
          <input type="text" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
        </div>
        <div class="form-group" *ngIf="! isHidden(metadata) && value[metadata.propertyName] && metadata.propertyType === 'Date'">
          <label>{{displayName(metadata)}}</label>
          <input type="date" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
        </div>
        <div class="form-group" *ngIf="! isHidden(metadata) && value[metadata.propertyName] && metadata.propertyType === 'ShortTime'">
          <label>{{displayName(metadata)}}</label>
          <input type="time" class="form-control" [(ngModel)]="value[metadata.propertyName]" name="{{metadata.propertyName}}">
        </div>


        <!--<div class="form-group" *ngIf="info.typeInfo.dataType == enumEnum && info.isVisible">
          <label>{{info.name}}</label>
          <select type="text" class="form-control">
            <option *ngFor="let o of info.typeInfo.options" [value]="o">{{o.name}}</option>
          </select>
        </div>-->

      </ul>
    </div>

  <div class="container">
    <button type="submit" class="btn btn-primary" (click)='cancel()'>Abbruch</button>
    <button type="submit" class="btn btn-primary" (click)='submit()'>
      <span class="glyphicon glyphicon-save"></span> Speichern
    </button>
    <button type="submit" class="btn btn-primary" (click)='confirm()'>    
      <span class="glyphicon glyphicon-trash"></span> Löschen
    </button>
    <button type="submit" class="btn btn-primary" (click)="showmodal()">
      <span class="glyphicon glyphicon-trash"></span> Löschen mit eigener Komponente
    </button>
    <flx-popup (onAnswer)="delete($event)" [title]="'Löschen?'" [message]="'Soll wirklich gelöscht werden?'"
      *ngIf="askuser">Löschbestätigung</flx-popup>

    </div>
  </form>
</div>  
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
   * Metainformation für alle Modelspalten (-> entityName)
   * 
   * @type {ColumnMetadata[]}
   * @memberOf AutoformDetailComponent
   */
  public columnMetadata: ColumnMetadata[];

  public askuser: boolean;


  constructor(router: Router, route: ActivatedRoute, service: ProxyService, private injector: Injector,
    private confirmationService: ConfirmationService, private metadataService: MetadataService) {
    super(router, route, service);
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

  /**
   * Bricht den Dialog ab und navigiert zum Topic-Pfad des Services
   */
  public cancel(): void {
    this.navigate([this.service.getTopicPath()]);
  }

  /**
   * Speichert Änderungen an der Entity
   */
  public submit() {
    const me = this;
    this.registerSubscription(this.service.update(this.value).subscribe(
      (value) => {
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
  public delete(event) {
    if (event === true) {
      const me = this;
      this.registerSubscription(this.service.delete(this.service.getEntityId(this.value)).subscribe(
        (value) => {
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
  public isHidden(metadata: ColumnMetadata): boolean {
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
    return rval;
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