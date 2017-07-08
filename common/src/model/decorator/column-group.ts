import { InstanceAccessor } from '@fluxgate/core';

import { MetadataStorage } from '../metadata/metadataStorage';

export interface IColumnGroupOptions {
  displayName: string;
  order?: number;
}

/**
 * Decorator: definiert die Property der Client-Id (Mandantenfähigkeit)
 */
export function ColumnGroup1(groupName: string, options?: IColumnGroupOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object, propertyName: string) => {
    MetadataStorage.instance.addColumnGroup(target.constructor, propertyName, groupName, options);
  };
}


// TODO: test
export function ColumnGroup2<T>(
  groupName: string,
  // dataSource: (type?: T) => ICtor<T>,
  prop: Array<InstanceAccessor<T, any>>,
  order?: number
) {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object) => {
    // TODO
  };
}

export function ColumnGroup<T>(groupName: string, columnNames: string[], options?: IColumnGroupOptions) {
  // tslint:disable-next-line:only-arrow-functions
  return (target: object) => {
    MetadataStorage.instance.addColumnGroups(target.constructor, groupName, columnNames, options);
  };
}