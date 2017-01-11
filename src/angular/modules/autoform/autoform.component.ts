import { NgModule, Component, Injector } from '@angular/core';
import { IFieldOptions } from './autoformConfig.interface';
import { IAutoformConfig } from './autoformConfig.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG
import { ButtonModule, SharedModule, ConfirmDialogModule } from 'primeng/primeng'
import { MessagesModule, ConfirmationService } from 'primeng/primeng';

import { Subscription } from 'rxjs/Subscription';

// Fluxgate
import { TableMetadata, ColumnMetadata, ColumnTypes, Constants, Assert } from '@fluxgate/common'

import { MetadataService } from '../../services';
import { BaseComponent } from '../../common/base';

import { ProxyService } from './proxy.service';
import { AutoformConstants } from './autoformConstants';

@Component({
  selector: 'flx-autoform',
  template: `
<div class="container">
  <div [hidden]="submitted">
    <h1>{{pageTitle}}</h1>
    <form *ngIf="active && item">
      <p-messages [value]="messages"></p-messages>

      <div>
        <ul *ngFor="let metadata of columnMetadata">
          <div class="form-group" *ngIf="isNotHidden(metadata) && item[metadata.propertyName] && metadata.propertyType === 'string'">
            <label>{{displayName(metadata)}}</label>
            <input type="text" class="form-control" [(ngModel)]="item[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>
          <div class="form-group" *ngIf="isNotHidden(metadata) && item[metadata.propertyName] && metadata.propertyType === 'number'">
            <label>{{displayName(metadata)}}</label>
            <input type="text" class="form-control" [(ngModel)]="item[metadata.propertyName]" name="{{metadata.propertyName}}">
          </div>

          <!--<div class="form-group" *ngIf="info.typeInfo.dataType == enumEnum && info.isVisible">
            <label>{{info.name}}</label>
            <select type="text" class="form-control">
              <option *ngFor="let o of info.typeInfo.options" [value]="o">{{o.name}}</option>
            </select>
          </div>-->

        </ul>
      </div>

      <button pButton type="submit" class="btn btn-default" (click)='cancel()' label="Abbruch"></button>
      <button pButton type="submit" class="btn btn-default" (click)='submit()' label="Speichern"></button>
      <button pButton type="submit" class="btn" (click)='confirm()' icon="fa-trash-o" label="Löschen"></button>
      <button pButton type="text" (click)="showmodal()" icon="fa-trash-o" label="Löschen mit eigener Komponente"></button>
      <flx-popup (onAnswer)="delete($event)" [title]="'Löschen?'" [message]="'Soll wirklich gelöscht werden?'"
        *ngIf="askuser">Löschbestätigung</flx-popup>

    </form>
  </div>
</div>  
`,
  styles: [],
  providers: [ConfirmationService]
})
export class AutoformComponent extends BaseComponent<ProxyService> {
  public static DETAILS = 'Details';

  public pageTitle: string = AutoformComponent.DETAILS;
  public item: any;
  public askuser: boolean;
  public submitted: boolean = false;
  public active: boolean = true;
  public columnTypes: ColumnTypes = ColumnTypes;

  public columnMetadata: ColumnMetadata[];
  private config: IAutoformConfig;


  private sub: Subscription;

  constructor(router: Router, service: ProxyService, private route: ActivatedRoute,
    private injector: Injector,
    private confirmationService: ConfirmationService, private metadataService: MetadataService) {
    super(router, service);
  }

  ngOnInit() {
    super.ngOnInit();

    this.sub = this.route.params.subscribe(
      params => {
        let id = <string>params[AutoformConstants.GENERIC_ENTITY_ID];
        let entityName = <string>params[AutoformConstants.GENERIC_ENTITY];
        this.config = JSON.parse(params[AutoformConstants.GENERIC_CONFIG]);

        this.setupProxy(entityName);

        this.getItem(id);
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }


  private getItem(id: any) {
    this.service.findById(id).subscribe(
      item => this.item = item,
      (error: Error) => {
        this.handleError(error);
      });
  }

  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und 
   * den ProxyService damit initialisieren
   */
  private setupProxy(entityName: string) {
    let tableMetadata: TableMetadata = this.metadataService.findTableMetadata(entityName);
    // console.log(`table = ${tableMetadata.options.name}`);
    this.columnMetadata = tableMetadata.columnMetadata;

    let service = this.injector.get(tableMetadata.service);
    this.service.proxyService(service);
  }


  confirm() {
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
  cancel(): void {
    this.navigate([this.service.getTopicPath()]);
  }

  /**
   * Speichert Änderungen an der Entity
   */
  submit() {
    let me = this;
    this.service.update(this.item).subscribe(
      item => {
        this.item = item;
        me.cancel();
      },
      (error: Error) => {
        this.handleError(error);
      });
  }

  /**
   * Löscht die Entity
   */
  delete(event) {
    if (event === true) {
      let me = this;
      this.service.delete(this.service.getEntityId(this.item)).subscribe(
        item => {
          this.item = item;
          me.cancel();
        },
        (error: Error) => {
          this.handleError(error);
        });
    }
    this.askuser = false;
  }


  showmodal() {
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

    let columnConfig = <IFieldOptions>this.config.fields[metadata.propertyName];
    if (columnConfig) {
      displayName = columnConfig.displayName;
    }

    return displayName;
  }

  /**
   * Liefert true, falls Feld zu @param{metadata} anzuzeigen ist
   */
  public isNotHidden(metadata: ColumnMetadata): boolean {
    let rval = metadata.options.displayName !== undefined;

    if (this.config.hiddenFields.indexOf(metadata.propertyName) >= 0) {
      rval = false;
    }
    return rval;
  }
}