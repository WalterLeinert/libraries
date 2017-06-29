import { Assert, Funktion } from '@fluxgate/core';

import { EnumTableOptions } from '../decorator/enumTableOptions';
import { MetadataStorage } from './metadataStorage';
import { TableMetadataInternal } from './tableMetadataInternal';

export class EnumTableMetadata extends TableMetadataInternal {

  constructor(metadataStorage: MetadataStorage, target: Funktion, options: EnumTableOptions) {
    super(metadataStorage, target, options);

    Assert.that(options instanceof EnumTableOptions);
  }
}