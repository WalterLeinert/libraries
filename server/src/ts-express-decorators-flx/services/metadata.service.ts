import { Service } from 'ts-express-decorators';

// fluxgate
import { MetadataStorage, TableMetadata } from '@fluxgate/common';
import {
  ClassConverterMetadata, ClassSerializerMetadata, ConverterKey,
  ConverterMetadataStorage, ConverterRegistry, Funktion,
  IConverterTuple, SerializerMetadataStorage
} from '@fluxgate/core';

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

  /**
   * Liefert @see{ClassSerializerMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   * für Serialisierungssupport
   *
   * @param {(Funktion | string)} model
   * @returns {ClassSerializerMetadata}
   *
   * @memberof MetadataService
   */
  public findClassSerializerMetadata(model: Funktion | string): ClassSerializerMetadata {
    return SerializerMetadataStorage.instance.findClassMetadata(model);
  }


  /**
   * Liefert @see{ClassConverterMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   * für Konvertierungssupport
   *
   * @param {(Funktion | string)} model
   * @returns {ClassConverterMetadata}
   *
   * @memberof MetadataService
   */
  public findClassConverterMetadata(model: Funktion | string): ClassConverterMetadata {
    return ConverterMetadataStorage.instance.findClassConverterMetadata(model);
  }

  /**
   * Liefert ein @see{IConverterTuple} für den angegebenen Key @param{key}.
   *
   * @template TFrom
   * @template TTo
   * @param {ConverterKey} key
   * @returns {IConverterTuple<TFrom, TTo>}
   *
   * @memberof MetadataService
   */
  public findConverterTuple<TFrom, TTo>(key: ConverterKey): IConverterTuple<TFrom, TTo> {
    return ConverterRegistry.get<TFrom, TTo>(key);
  }

}