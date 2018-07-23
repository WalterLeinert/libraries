import { HttpClient } from '@angular/common/http';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { IServiceBase, TableMetadata } from '@fluxgate/common';
import {
  Assert, Funktion, InvalidOperationException
} from '@fluxgate/core';

import { AppConfigService } from '../../services/app-config.service';
import { MetadataService } from '../../services/metadata.service';
import { ServiceCore } from './service-core';

/**
 * Abstract base class for common rest-api service calls
 */
export abstract class ServiceBase<T, TId> extends ServiceCore implements IServiceBase<T, TId> {
  protected static logger = getLogger(ServiceBase);

  private _tableMetadata: TableMetadata;

  /**
   * Creates an instance of ServiceBase.
   *
   * @param _http - Http client
   * @param baseUrl - base url of request
   */
  protected constructor(model: Funktion, private metadataService: MetadataService, http: HttpClient,
    configService: AppConfigService, topic: string) {
    super(http, configService.config.url,
      topic === undefined ? metadataService.findTableMetadata(model).options.name : topic);

    Assert.notNull(model, 'model');

    // Metadaten zur Entity ermitteln
    this._tableMetadata = this.metadataService.findTableMetadata(model);
    Assert.notNull(this._tableMetadata);
  }



  /**
   * Liefert den Klassennamen der zugehörigen Modellklasse (Entity).
   */
  public getModelClassName(): string {
    return this._tableMetadata.className;
  }

  public getTableName(): string {
    return this._tableMetadata.tableName;
  }


  /**
   * Liefert die zugehörige @see{TableMetadata}
   */
  public get tableMetadata(): TableMetadata {
    return this._tableMetadata;
  }



  /**
   * Liefert die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   */
  public getEntityId(item: T): TId {
    if (!this.tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableMetadata.options.name}: no primary key column`);
    }
    return item[this.tableMetadata.primaryKeyColumn.propertyName];
  }


  /**
   * Setzt die Id der Entity @param{item} über die Metainformation, falls vorhanden.
   * Sonst wird ein Error geworfen.
   */
  public setEntityId(item: T, id: TId) {
    if (!this.tableMetadata.primaryKeyColumn) {
      throw new InvalidOperationException(`Table ${this.tableMetadata.options.name}: no primary key column`);
    }
    item[this.tableMetadata.primaryKeyColumn.propertyName] = id;
  }

}