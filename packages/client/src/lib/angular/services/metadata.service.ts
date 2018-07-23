import { Injectable } from '@angular/core';

import { MetadataStorage, TableMetadata } from '@fluxgate/common';
import {
  Assert, ClassSerializerMetadata, ConverterRegistry,
  Funktion, IConverter,
  SerializerMetadataStorage, Types
} from '@fluxgate/core';


@Injectable()
export class MetadataService {

  /**
   * Liefert @see{TableMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   *
   * @param model
   * @returns
   */
  public findTableMetadata(model: Funktion | string): TableMetadata {
    Assert.notNull(model);
    if (Types.isString(model)) {
      MetadataStorage.instance.findTableMetadata(model);
    }
    return MetadataStorage.instance.findTableMetadata(model as Funktion);
  }


  /**
   * Liefert alle TableMetadatas
   *
   * @readonly
   */
  public get tableMetadata(): TableMetadata[] {
    return MetadataStorage.instance.tableMetadata;
  }


  /**
   * Liefert @see{ClassSerializerMetadata} für die angegebene Modellklasse @param{model} (z.B. Artikel)
   * für Serialisierungssupport
   *
   * @param model
   * @returns
   */
  public findClassSerializerMetadata(model: Funktion | string): ClassSerializerMetadata {
    return SerializerMetadataStorage.instance.findClassMetadata(model);
  }


  /**
   * Liefert einen @see{IConverter} für den angegebenen Typ @param{type} oder undefined.

   * @param  type
   * @returns
   */
  public findConverter<T1, T2>(type: string | Funktion): IConverter<T1, T2> {
    return ConverterRegistry.get<T1, T2>(type);
  }
}