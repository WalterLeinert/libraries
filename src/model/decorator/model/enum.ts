import { Assert } from '../../../util';
import { Time, ShortTime } from '../../../types';
import { IEnumOptions } from './enumOptions.interface';
import { ColumnTypes } from '../../metadata/columnTypes';
import { EnumMetadata } from '../../metadata/enumMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { ColumnTypeUndefinedError } from '../../error/columnTypeUndefinedError';

/**
 * Enum-Decorator für Modellproperties/-attribute, deren Werteliste aus einer Tabelle stammen 
 * 
 * @export
 * @param {IEnumOptions} [options]
 * @returns
 */
export function Enum(options?: IEnumOptions) {
    return function (target: any, propertyName: string) {

        Assert.notNull(options);
        MetadataStorage.instance.addEnumMetadata(new EnumMetadata(target.constructor, propertyName, options));
    };
}