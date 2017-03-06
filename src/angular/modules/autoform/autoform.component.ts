// tslint:disable:max-line-length

import { Component, Injector } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';

import { ActivatedRoute, Router } from '@angular/router';
import { IFieldOptions } from './autoformConfig.interface';
import { IAutoformConfig } from './autoformConfig.interface';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';
// -------------------------------------- logging --------------------------------------------


import { Subscription } from 'rxjs/Subscription';

// Fluxgate
import { ColumnMetadata, ColumnTypes, TableMetadata } from '@fluxgate/common';

import { BaseComponent } from '../../common/base';
import { MetadataService, ProxyService } from '../../services';

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


            <label>{{displayName(metadata)}} ({{metadata.propertyType}})</label>
            <input type="time" class="form-control" [(ngModel)]="item[metadata.propertyName]" name="{{metadata.propertyName}}">


          <div class="form-group" *ngIf="isNotHidden(metadata) && item[metadata.propertyName] && metadata.propertyType === 'Date'">
            <label>{{displayName(metadata)}}</label>
            <input type="date" class="form-control" [(ngModel)]="item[metadata.propertyName]" name="{{metadata.propertyName}}">
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
  protected static readonly logger = getLogger(AutoformComponent);

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

  constructor(router: Router, route: ActivatedRoute, service: ProxyService,
    private injector: Injector,
    private confirmationService: ConfirmationService, private metadataService: MetadataService) {
    super(router, route, service);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();

    this.registerSubscription(this.sub = this.route.params.subscribe(
      (params) => {
        const id = params[AutoformConstants.GENERIC_ENTITY_ID] as string;
        const entityName = params[AutoformConstants.GENERIC_ENTITY] as string;
        this.config = JSON.parse(params[AutoformConstants.GENERIC_CONFIG]);

        this.setupProxy(entityName);

        this.getItem(id);
      }));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }


  public confirm() {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'confirm'), (log) => {
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
    this.registerSubscription(this.service.update(this.item).subscribe(
      (item: any) => {
        this.item = item;
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
      this.registerSubscription(this.service.delete(this.service.getEntityId(this.item)).subscribe(
        (item: any) => {
          this.item = item;
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

    const columnConfig = this.config.fields[metadata.propertyName] as IFieldOptions;
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


  private getItem(id: any) {
    this.registerSubscription(this.service.findById(id).subscribe(
      (item: any) => this.item = item,
      (error: Error) => {
        this.handleError(error);
      }));
  }

  /**
   * mittels MetadataService für die Entity @see{entityName} den zugehörigen Service ermitteln und 
   * den ProxyService damit initialisieren
   */
  private setupProxy(entityName: string) {
    using(new XLog(AutoformComponent.logger, levels.INFO, 'setupProxy', `entityName = ${entityName}`), (log) => {
      const tableMetadata: TableMetadata = this.metadataService.findTableMetadata(entityName);
      log.log(`table = ${tableMetadata.options.name}`);
      this.columnMetadata = tableMetadata.columnMetadata;

      const service = tableMetadata.getServiceInstance(this.injector);
      this.service.proxyService(service);
    });
  }

}