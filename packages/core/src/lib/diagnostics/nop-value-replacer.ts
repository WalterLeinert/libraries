import { Injectable } from 'injection-js';

import { IValueReplacer } from './value-replacer.interface';

@Injectable()
export class NopValueReplacer implements IValueReplacer {
  public replace(object: any, propertyName: string, propertyValue: any): any {
    return propertyValue;
  }
}