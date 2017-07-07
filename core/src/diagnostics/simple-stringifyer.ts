import { Injectable } from 'injection-js';

import { JsonDumper } from './json-dumper';
import { IStringifyer } from './stringifyer.interface';

@Injectable()
export class SimpleStringifyer implements IStringifyer {
  public stringify(value: any): string {
    return JsonDumper.stringify(value);
  }
}