import { Funktion } from '@fluxgate/core';

import { EnumTableOptions } from '../decorator/model/enumTableOptions';
import { TableOptions } from '../decorator/model/tableOptions.interface';
import { TableMetadata } from './tableMetadata';


/**
 *  Modelliert Metadaten für Modellklasse/DB-Tabelle (interne Klasse als Erweiterung zuu TableMetadata)
 *
 * @export
 * @class TableMetadata
 */
export class TableMetadataInternal extends TableMetadata {
  private _serviceClazz: Funktion;

  constructor(target: Funktion, options: TableOptions | EnumTableOptions) {
    super(target, options);
  }

  /**
   * Liefert die zugehörige Serviceklasse (oder undefined)
   */
  public get serviceClazz(): Funktion {
    return this._serviceClazz;
  }

  /**
   * Registriert die zugehörigen Serviceklasse (Class/Constructor Function)
   */
  public registerServiceClazz(serviceClazz: Funktion) {
    this._serviceClazz = serviceClazz;
  }

}