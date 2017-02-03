// tslint:disable:max-line-length

import { CommonModule } from '@angular/common';
import { Component, Injector, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


// PrimeNG
import { ButtonModule, ConfirmDialogModule, SharedModule } from 'primeng/primeng';
import { ConfirmationService, MessagesModule } from 'primeng/primeng';

import { Subscription } from 'rxjs/Subscription';

// Fluxgate
import { Assert, ColumnMetadata, ColumnTypes, Constants, TableMetadata } from '@fluxgate/common';

import { BaseComponent } from '../../common/base';
import { MetadataService, ProxyService } from '../../services';

import { IFieldOptions } from './autoformConfig.interface';
import { IAutoformConfig } from './autoformConfig.interface';
import { AutoformConstants } from './autoformConstants';



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


  constructor(router: Router, service: ProxyService, private injector: Injector,
    private confirmationService: ConfirmationService, private metadataService: MetadataService) {
    super(router, service);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupProxy(this.entityName);
  }

  public confirm() {
    this.confirmationService.confirm({
      header: 'Löschen',
      message: 'Soll wirklich gelöscht werden?',
      accept: () => {
        console.log('Löschen');
        this.delete(true);
      },
      reject: () => {
        console.log('Abbruch');
      }
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
    this.service.update(this.value).subscribe(
      (value) => {
        this.value = value;
        me.cancel();
      },
      (error: Error) => {
        this.handleError(error);
      });
  }

  /**
   * Löscht die Entity
   */
  public delete(event) {
    if (event === true) {
      const me = this;
      this.service.delete(this.service.getEntityId(this.value)).subscribe(
        (value) => {
          this.value = value;
          me.cancel();
        },
        (error: Error) => {
          this.handleError(error);
        });
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


  private getItem(id: any) {
    this.service.findById(id).subscribe(
      (value) => this.value = value,
      (error: Error) => {
        this.handleError(error);
      });
  }


  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und 
   * den ProxyService damit initialisieren
   */
  private setupProxy(entityName: string) {
    const tableMetadata: TableMetadata = this.metadataService.findTableMetadata(entityName);

    Assert.notNull(tableMetadata, `No metadata for entity ${entityName}`);

    // console.log(`table = ${tableMetadata.options.name}`);
    this.columnMetadata = tableMetadata.columnMetadata;

    const service = this.injector.get(tableMetadata.service);
    this.service.proxyService(service);
  }


}