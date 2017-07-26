import { Assert, ConverterRegistry, StringBuilder, Types } from '@fluxgate/core';

import { ColumnMetadata } from '../metadata/columnMetadata';
import { ColumnTypes } from '../metadata/columnTypes';
import { ValidationResult } from './validationResult';
import { Validator } from './validator';


/**
 * Interface für die Spezifikation von Bereichen
 *
 * @export
 * @interface IRangeOptions
 */
export interface IRangeOptions {

  /**
   * minimal zulässige untere Grenze
   *
   * @type {number}
   * @memberof IRangeOptions
   */
  min?: number;

  /**
   * minimal zulässige obere Grenze
   *
   * @type {number}
   * @memberof IRangeOptions
   */
  max?: number;
}



/**
 * Validator für Bereichsprüfungen
 *
 * unterstützt werden z.Zt:
 * - String-Proeprties
 * - Number-Properties
 * - Arrays
 *
 * @export
 * @class RangeValidator
 * @extends {Validator}
 */
export class RangeValidator extends Validator {

  constructor(private _options: IRangeOptions, info?: string) {
    super(info);
    Assert.notNull(_options);
    Assert.that(_options.min !== undefined || _options.max !== undefined);
  }

  public validate(value: any, property?: string | ColumnMetadata): ValidationResult {
    if (!Types.isPresent(value)) {
      return ValidationResult.Ok;
    }

    const sb = new StringBuilder();

    if (this._options.min !== undefined) {
      if (!RangeValidator.isLessOrGreaterThan(value, property, this._options.min, sb,
        ((v1, v2) => v1 < v2), 'less', 'less')) {
        return ValidationResult.create(this, property, false, sb.toString());
      }
    }

    if (this._options.max !== undefined) {
      if (!RangeValidator.isLessOrGreaterThan(value, property, this._options.max, sb,
        ((v1, v2) => v1 > v2), 'more', 'greater')) {
        return ValidationResult.create(this, property, false, sb.toString());
      }
    }

    return ValidationResult.Ok;
  }


  public get options(): IRangeOptions {
    return this._options;
  }



  private static isLessOrGreaterThan(value: any, property: string | ColumnMetadata, minMax: number,
    sb: StringBuilder, compare: ((val: number, threshold: number) => boolean),
    minMaxTest: string, minMaxTestNumber: string): boolean {
    let rval = true;

    //
    // Validierungstest über Metadaten?
    //
    if (property instanceof ColumnMetadata) {
      if (property.propertyType === ColumnTypes.STRING) {
        if (typeof value === 'string') {
          if (compare(value.length, minMax)) {
            sb.append(`Text may not contain ${minMaxTest} than ${minMax} characters.`);
            rval = false;
          }
        }
      } else if (property.propertyType === ColumnTypes.NUMBER) {
        const converter = ConverterRegistry.get<number, string>(Number.name);

        try {
          const numberValue = converter.convertBack(value);
          if (compare(numberValue, minMax)) {
            sb.append(`${numberValue} may not be ${minMaxTestNumber} than ${minMax}.`);
            rval = false;
          }
        } catch (exc) {
          sb.append(`Value '${value}' no valid number.`);
          rval = false;
        }
      } else {
        sb.append(`Value '${value}' no valid number.`);
        rval = false;
      }
    } else {

      //
      // Validierungstest über Typ von value
      //
      if (typeof value === 'string') {
        if (compare(value.length, minMax)) {
          sb.append(`Text '${value}' may not contain ${minMaxTest} than ${minMax} characters.`);
          rval = false;
        }
      } if (typeof value === 'number') {
        if (compare(value, minMax)) {
          sb.append(`Value may not be ${minMaxTestNumber} than ${minMax}.`);
          rval = false;
        }
      } else if (Array.isArray(value)) {
        if (compare(value.length, minMax)) {
          sb.append(`Array [${value.length}] may not contain ${minMaxTest} than ${minMax} elements.`);
          rval = false;
        }
      }
    }

    return rval;
  }
}