import { Injectable } from '@angular/core';

import { MetadataStorage, TableMetadata } from '@fluxgate/common';


@Injectable()
export class MetadataService {

  constructor() { }

  /**
   * Liefert @see{TableMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   * 
   * @param {Function} model
   * @returns {TableMetadata}
   * 
   * @memberOf MetadataService
   */
  public findTableMetadata(model: Function): TableMetadata {
    return MetadataStorage.instance.findTableMetadata(model);
  }
}