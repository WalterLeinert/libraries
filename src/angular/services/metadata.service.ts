import { Injectable } from '@angular/core';

import { Assert, MetadataStorage, TableMetadata } from '@fluxgate/common';


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
  public findTableMetadata(model: Function): TableMetadata;
  // tslint:disable-next-line:unified-signatures
  public findTableMetadata(model: string): TableMetadata;

  // tslint:disable-next-line:unified-signatures
  public findTableMetadata(model: Function | string): TableMetadata {
    Assert.notNull(model);
    if (typeof (model) === 'string') {
      MetadataStorage.instance.findTableMetadata(model);
    }
    return MetadataStorage.instance.findTableMetadata(model as Function);
  }
}