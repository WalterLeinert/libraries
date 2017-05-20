import { Assert, Funktion } from '@fluxgate/core';

import { EnumTableOptions } from '../decorator/enumTableOptions';
import { TableMetadataInternal } from './tableMetadataInternal';

export class EnumTableMetadata extends TableMetadataInternal {

  constructor(target: Funktion, options: EnumTableOptions) {
    super(target, options);

    Assert.that(options instanceof EnumTableOptions);
  }
}