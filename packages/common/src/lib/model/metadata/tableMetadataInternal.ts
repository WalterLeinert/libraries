import { Funktion } from '@fluxgate/core';

import { EnumTableOptions } from '../decorator/enumTableOptions';
import { TableOptions } from '../decorator/tableOptions.interface';
import { MetadataStorage } from './metadataStorage';
import { TableMetadata } from './tableMetadata';


/**
 *  Modelliert Metadaten für Modellklasse/DB-Tabelle (interne Klasse als Erweiterung zuu TableMetadata)
 *
 * @export
 * @class TableMetadata
 */
export class TableMetadataInternal extends TableMetadata {
  private _serviceClazz: Funktion;
  private _serviceRequestsClazz: Funktion;

  constructor(metadataStorage: MetadataStorage, target: Funktion, options: TableOptions | EnumTableOptions) {
    super(metadataStorage, target, options);
  }

  /**
   * Liefert die zugehörige Serviceklasse (oder undefined)
   */
  public get serviceClazz(): Funktion {
    return this._serviceClazz;
  }


  /**
   * Liefert die zugehörige ServiceRequests-Klasse (oder undefined)
   */
  public get serviceRequestsClazz(): Funktion {
    return this._serviceRequestsClazz;
  }

  /**
   * Registriert die zugehörigen Serviceklasse (Class/Constructor Function)
   */
  public registerServiceClazz(serviceClazz: Funktion) {
    this._serviceClazz = serviceClazz;
  }

  public registerServiceRequestsClazz(serviceRequestsClazz: Funktion) {
    this._serviceRequestsClazz = serviceRequestsClazz;
  }

}