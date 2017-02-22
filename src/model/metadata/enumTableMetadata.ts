import { Assert } from '../../util/assert';
import { EnumTableOptions } from '../decorator/model/enumTableOptions';

import { TableMetadata } from './tableMetadata';

export class EnumTableMetadata extends TableMetadata {

  constructor(target: Function, options: EnumTableOptions) {
    super(target, options);

    Assert.that(options instanceof EnumTableOptions);
  }
}