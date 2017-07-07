import entries = require('object.entries');

import { Core } from '../diagnostics/core';
import { NotSupportedException } from '../exceptions/notSupportedException';
import { Dictionary } from '../types/dictionary';
import { Types } from '../types/types';
import { StringBuilder } from './stringBuilder';

export class FlattenJson {
  private _result: Dictionary<string, any>;

  constructor(private json: any) {
    this._result = new Dictionary<string, any>();
  }


  public flatten() {
    this.flattenRec('', this.json);
  }

  public get result(): Dictionary<string, any> {
    return this._result;
  }

  public toString(): string {

    const sb = new StringBuilder();
    const sortedKey = this._result.keys.sort();

    for (const key of sortedKey) {
      const value: any = this._result.get(key);

      sb.append(key);
      sb.append(': ');
      sb.appendLine(Types.isString(value) ? '"' + value + '"' : value.toString());
    }

    return sb.toString();
  }


  private flattenRec(prefix: string, obj: any) {
    const props = entries(obj);


    for (const prop of props) {
      const propName: string = prop[0];
      const propValue: any = prop[1];

      const key = Types.isNullOrEmpty(prefix) ? propName : prefix + '.' + propName;

      // tslint:disable-next-line:no-console
      // console.log(`prop = ${Core.stringify(prop)}`);

      if (Types.isPrimitive(propValue)) {
        this._result.set(key, propValue);
      } else if (Types.isObject(propValue)) {
        this.flattenRec(key, propValue);
      } else {
        throw new NotSupportedException(`propName: ${propName}, propValue: ${Core.stringify(propValue)}`);
      }
    }
  }

}