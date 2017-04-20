// Fluxgate
import { ColumnType, ColumnTypes } from '@fluxgate/common';
import { NotSupportedException } from '@fluxgate/core';

import { ControlType } from '../../angular/modules/common/controlType';

export type DataType = 'string' | 'number' | 'date' | 'time' | 'enum';

export class DataTypes {
  public static readonly STRING: DataType = 'string';
  public static readonly NUMBER: DataType = 'number';
  public static readonly DATE: DataType = 'date';
  public static readonly TIME: DataType = 'time';
  public static readonly ENUM: DataType = 'enum';


  /**
   * Liefert für den @see{ColumnType} @param{columnType} den entsprechenden @see{DataType}.
   * Falls keine Zuordnung existiert wird eine @see{NotSupportedException} geworfen.
   *
   * @static
   * @param {ColumnType} columnType
   * @returns {DataType}
   *
   * @memberOf DataTypes
   */
  public static mapColumnTypeToDataType(columnType: ColumnType): DataType {

    if (ColumnTypes.isNumeric(columnType)) {
      return DataTypes.NUMBER;
    }

    if (ColumnTypes.isDate(columnType)) {
      return DataTypes.DATE;
    }

    if (ColumnTypes.isTime(columnType)) {
      return DataTypes.TIME;
    }

    switch (columnType) {
      case ColumnTypes.STRING:
      case ColumnTypes.TEXT:
        return DataTypes.STRING;

      default:
        throw new NotSupportedException(`Unsupported columnType ${columnType}`);
    }
  }

  /**
   * Liefert für den @param{type} den entsprechenden @see{ControlType}.
   * Falls keine Zuordnung existiert wird eine @see{NotSupportedException} geworfen.
   *
   * @static
   * @param {ColumnType} columnType
   * @returns {DataType}
   *
   * @memberOf DataTypes
   */
  public static mapDataTypeToControlType(type: DataType): ControlType {
    switch (type) {

      case DataTypes.STRING:
      case DataTypes.NUMBER:
        return ControlType.Input;

      case DataTypes.DATE:
        return ControlType.Date;

      case DataTypes.TIME:
        return ControlType.Time;

      case DataTypes.ENUM:
        return ControlType.DropdownSelector;

      default:
        throw new NotSupportedException(`Unsupported type ${type}`);
    }
  }
}