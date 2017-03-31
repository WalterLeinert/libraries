import { Injectable } from '@angular/core';

import { Assert, Funktion, MetadataStorage, TableMetadata } from '@fluxgate/common';


@Injectable()
export class MetadataService {

  /**
   * Liefert @see{TableMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   * 
   * @param {Function} model
   * @returns {TableMetadata}
   * 
   * @memberOf MetadataService
   */
  public findTableMetadata(model: Funktion): TableMetadata;
  // tslint:disable-next-line:unified-signatures
  public findTableMetadata(model: string): TableMetadata;

  // tslint:disable-next-line:unified-signatures
  public findTableMetadata(model: Funktion | string): TableMetadata {
    Assert.notNull(model);
    if (typeof (model) === 'string') {
      MetadataStorage.instance.findTableMetadata(model);
    }
    return MetadataStorage.instance.findTableMetadata(model as Funktion);
  }
}