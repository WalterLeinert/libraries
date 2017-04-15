import { Service } from 'ts-express-decorators';

// fluxgate
import { MetadataStorage, TableMetadata } from '@fluxgate/common';
import { Funktion } from '@fluxgate/core';

/**
 * Service für den Zugriff auf Modell-Metadaten
 */
@Service()
export class MetadataService {

  /**
   * Liefert @see{TableMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   *
   * @param {Function} model
   * @returns {TableMetadata}
   *
   * @memberOf MetadataService
   */
  public findTableMetadata(model: Funktion): TableMetadata {
    return MetadataStorage.instance.findTableMetadata(model);
  }

}