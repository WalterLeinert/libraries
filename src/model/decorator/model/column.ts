import { Time } from '../../../types/time';
import { ColumnOptions } from './columnOptions';
import { ColumnTypes } from '../../metadata/columnTypes';
import { ColumnMetadata } from '../../metadata/columnMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { ColumnTypeUndefinedError } from '../../error/columnTypeUndefinedError';

/**
 * Column-Decorator für Modellproperties/-attribute
 * 
 * @export
 * @param {ColumnOptions} [options]
 * @returns
 */
export function Column(options?: ColumnOptions) {
    return function (target: any, propertyName: string) {

        let propertyType: Function = (Reflect as any).getMetadata('design:type', target, propertyName);

        //
        // TODO: Workaround: da der Propertytype bei Date als Object und nicht als Date geliefert wird,
        // übernehmen wir Date, falls options.propertyType auf "date" gesetzt ist
        //
        if (options && options.propertyType) {
            if (options.propertyType === ColumnTypes.DATE) {
                propertyType = Date;
                console.warn(`${target.name}.${propertyName}: set type to ${propertyType}`);
            }
            if (options.propertyType === ColumnTypes.TIME) {
                propertyType = Time;
                console.warn(`${target.name}.${propertyName}: set type to ${propertyType}`);
            }
        }


        let reflectedType = ColumnTypes.typeToString(propertyType);
        // console.log(`${propertyName} reflectedType: ${reflectedType}`);

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

        if (!options.persisted) {
            options.persisted = true;
        }

        // if (!options.displayName) {
        //     options.displayName = propertyName;
        // }

        MetadataStorage.instance.addColumnMetadata(new ColumnMetadata(target.constructor, propertyName, reflectedType, options));
    };
}