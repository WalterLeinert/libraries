import entries = require('object.entries');


import { NotSupportedException } from '../exceptions/notSupportedException';
import { Types } from '../types/types';
import { StringBuilder } from './stringBuilder';

export class FlattenJson {
  private _result: any;

  constructor(private json: any) {
    this._result = {};
  }


  public flatten() {
    this.flattenRec('', this.json, this._result);
  }

  public get result(): any {
    return this._result;
  }

  public toString(): string {
    const props = entries(this._result);
    const sb = new StringBuilder();

    for (const prop of props) {
      const propName: string = prop[0];
      const propValue: any = prop[1];

      sb.append(propName);
      sb.append(': ');
      sb.appendLine(Types.isString(propValue) ? '"' + propValue + '"' : propValue.toString());
    }

    return sb.toString();
  }


  private flattenRec(prefix: string, obj: any, result: any) {
    const props = entries(obj);


    for (const prop of props) {
      const propName: string = prop[0];
      const propValue: any = prop[1];

      const key = Types.isNullOrEmpty(prefix) ? propName : prefix + '.' + propName;

      // tslint:disable-next-line:no-console
      // console.log(`prop = ${JSON.stringify(prop)}`);

      if (Types.isPrimitive(propValue)) {
        result[key] = propValue;
      } else if (Types.isObject(propValue)) {
        this.flattenRec(key, propValue, result);
      } else {
        throw new NotSupportedException(`propName: ${propName}, propValue: ${JSON.stringify(propValue)}`);
      }
    }
  }

}