import { Injectable } from 'injection-js';

import { IStringifyer } from './stringifyer.interface';

@Injectable()
export class SimpleStringifyer implements IStringifyer {
  public stringify(value: any): string {
    return JSON.stringify(value);
  }
}