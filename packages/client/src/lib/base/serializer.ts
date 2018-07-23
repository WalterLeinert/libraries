import { TableMetadata } from '@fluxgate/common';
import { Assert, NotSupportedException } from '@fluxgate/core';

/**
 * Hilfsklasse für die Serialisierung/Deserialisierung des Models.
 */
export class Serializer<T> {

  constructor(private tableMetadata: TableMetadata) {
  }


  /**
   * Serialisiert das @param{item} für die Übertragung zum Server über das REST-Api.
   *
   * TODO: ggf. die Serialisierung von speziellen Attributtypen (wie Date) implementieren
   *
   * @param item - Entity-Instanz
   * @returns
   */
  public serialize(item: T): any {
    Assert.notNull(item);
    return item;
  }


  /**
   * Deserialisiert das Json-Objekt, welches über das REST-Api vom Server zum Client übertragen wurde
   *
   * @param json - Json-Objekt vom Server
   * @returns
   */
  public deserialize(json: any): T {
    if (json === null) {
      return null;
    }

    // Die Properties im Json-Objekt haben dieselben Namen wie die Modellinstanz -> mapColumns = false
    return this.tableMetadata.createModelInstance<T>(json, false);
  }

  /**
   * Deserialisiert ein Array von Json-Objekten, welches über das REST-Api vom Server zum Client übertragen wurde
   *
   * @param json - Array von Json-Objekten vom Server
   * @returns
   */
  public deserializeArray(jsonArray: any): T[] {
    Assert.notNull(jsonArray);

    if (!Array.isArray(jsonArray)) {
      throw new NotSupportedException('json: ist kein Array');
    }

    const result = new Array<T>();
    jsonArray.forEach((item) => {
      result.push(this.deserialize(item));
    });

    return result;
  }

}