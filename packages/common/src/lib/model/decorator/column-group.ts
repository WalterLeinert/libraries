import { Funktion } from '@fluxgate/core';
import { MetadataStorage } from '../metadata/metadataStorage';


/**
 * Optionen für ColumnGroups
 */
export interface IColumnGroupOptions {

  /**
   * Der Anzeigename der Gruppe
   */
  displayName: string;

  /**
   * relative Position der Gruppe bzgl. anderer Gruppen
   */
  order?: number;
}

export function ColumnGroup<T>(groupName: string, columnNames: string[], options?: IColumnGroupOptions) {
  return (target: Funktion) => {
    MetadataStorage.instance.addColumnGroup(target, groupName, columnNames, options);
  };
}