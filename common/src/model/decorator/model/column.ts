// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Funktion, ShortTime, Time } from '@fluxgate/core';
import { getLogger } from '@fluxgate/platform';

import { ColumnTypeUndefinedError } from '../../error/columnTypeUndefinedError';
import { ColumnMetadata } from '../../metadata/columnMetadata';
import { ColumnTypes } from '../../metadata/columnTypes';
import { MetadataStorage } from '../../metadata/metadataStorage';

import { ColumnOptions } from './columnOptions';


const logger = getLogger(Column);

/**
 * Column-Decorator für Modellproperties/-attribute
 *
 * @export
 * @param {ColumnOptions} [options]
 * @returns
 */
export function Column(options?: ColumnOptions) {

  // tslint:disable-next-line:only-arrow-functions
  return function (target: any, propertyName: string) {

    let propertyType: Funktion = (Reflect as any).getMetadata('design:type', target, propertyName);

    //
    // TODO: Workaround: da der Propertytype bei Date als Object und nicht als Date geliefert wird,
    // übernehmen wir Date, falls options.propertyType auf "date" gesetzt ist
    //
    if (options && options.propertyType) {
      switch (options.propertyType) {
        case ColumnTypes.DATE:
        case ColumnTypes.DATETIME:
          propertyType = Date;
          logger.warn(`${target.name}.${propertyName}: set type to ${propertyType}`);
          break;

        case ColumnTypes.TIME:
          propertyType = Time;
          logger.warn(`${target.name}.${propertyName}: set type to ${propertyType}`);
          break;

        case ColumnTypes.SHORTTIME:
          propertyType = ShortTime;
          logger.warn(`${target.name}.${propertyName}: set type to ${propertyType}`);
          break;

        default:
          // ok
          break;
      }
    }

    // aus Propertytyp (Function) den ColumnType ermitteln
    let type = ColumnTypes.determineTypeFromFunction(propertyType);

    if (!options) {
      options = {} as ColumnOptions;
    }

    if (!options.type) {
      options = Object.assign({ type: type } as ColumnOptions, options);
    }

    if (!options.type) {
      throw new ColumnTypeUndefinedError(target, propertyName);
    }

    if (!options.name) {
      options.name = propertyName;
    }

    if (options.persisted === undefined) {
      options.persisted = true;       // default: Persistieren
    }

    /**
     * der bei den Optionen angegebene Typ hat immer Vorrang
     */
    if (options.propertyType) {
      type = options.propertyType;
    }

    MetadataStorage.instance.addColumnMetadata(new ColumnMetadata(target.constructor, propertyName,
      type, options));
  };
}