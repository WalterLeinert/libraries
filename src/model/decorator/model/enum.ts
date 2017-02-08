import { ObjectType } from '../../../base/objectType';
import { ShortTime, Time } from '../../../types';
import { Assert } from '../../../util';
import { ColumnTypeUndefinedError } from '../../error/columnTypeUndefinedError';
import { ColumnTypes } from '../../metadata/columnTypes';
import { EnumMetadata } from '../../metadata/enumMetadata';
import { MetadataStorage } from '../../metadata/metadataStorage';

/**
 * Enum-Decorator für Modellproperties/-attribute, deren Werteliste aus einer Tabelle stammen 
 * 
 * @export
 * @param {IEnumOptions} [options]
 * @returns
 */
export function Enum<T>(dataSource: (type?: any) => ObjectType<T>) {
    // tslint:disable-next-line:only-arrow-functions
    return function (target: any, propertyName: string) {
        Assert.notNull(dataSource);
        MetadataStorage.instance.addEnumMetadata(new EnumMetadata(target.constructor, propertyName, dataSource));
    };
}