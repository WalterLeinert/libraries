import { ClonerBase } from '../base/clone';
import { using } from '../base/disposable';
import { Funktion } from '../base/objectType';
import { StringBuilder } from '../base/stringBuilder';
import { CoreInjector } from '../di/core-injector';
import { Indenter } from '../suspendable/indenter';
import { Suspender } from '../suspendable/suspender';
import { Types } from '../types/types';
import { NopValueReplacer } from './nop-value-replacer';
import { IValueReplacer } from './value-replacer.interface';
import { VALUE_REPLACER } from './value-replacer.token';


export interface IJsonDumperOptions {
  maxDepth?: number;
  showInfo?: boolean;
}



class DumperInternal extends ClonerBase {
  private indenter: Indenter = new Indenter();
  private sb: StringBuilder = new StringBuilder();


  public constructor(private replacer: IValueReplacer, private options: IJsonDumperOptions) {
    super(true);
  }

  public dump<T>(value: T) {
    this.dumpRec(value);
  }


  public toString(): string {
    return this.sb.toString();
  }


  /**
   * gibt die Objektstruktur @param{value} rekursiv aus
   */
  private dumpRec<T>(value: T, attrName?: string) {
    if (!Types.isNullOrEmpty(attrName)) {
      this.indent(`"${attrName}": `);
    }

    // primitive Typen

    // undefined und null werden wie reguläre Primitive behandelt
    if (value === undefined || value == null) {
      this.sb.append(`${value}`);
      return;
    }

    // primitive Typen sind ok
    if (Types.isPrimitive(value)) {
      if (Types.isString(value)) {
        this.sb.append('"');
      }

      if (Types.isSymbol(value)) {
        this.sb.append(value.toString());
      } else {
        this.sb.append(`${value}`);
      }

      if (Types.isString(value)) {
        this.sb.append('"');
      }

      return;
    }

    if (value instanceof Date) {
      this.sb.append('"');
      this.sb.append(value.toISOString());
      this.sb.append('"');
      return;
    }

    if (Types.isFunction(value)) {

      const f = value as any as Funktion;

      this.sb.append(`${f.name}()`);
      return;
    }


    let cycleDetected = false;

    if (this.checkCycles) {

      // clone bereits erzeugt und registriert?
      const obj = super.getRegisteredObject(value);
      if (obj) {
        cycleDetected = true;

        if (!Types.isPresent(obj.constructor)) {
          this.indent(`  ----> cycle detected: obj.constructor === null`);
        } else {
          this.indent(`  ----> cycle detected: type = ${obj.constructor.name}`);
        }

        return;
      }

      // Objekt für Zykluserkennung registrieren, aber nur falls unser Dictionary dies unterstützt
      super.registerObjectFor(value, value);
    }


    if (Types.isArray(value)) {
      const arr = value as any as any[];
      this.sb.appendLine(`[`);

      if (this.indenter.Counter <= this.options.maxDepth) {

        using(new Suspender([this.indenter]), () => {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < arr.length; i++) {
            this.indent();

            this.dumpRec(arr[i]);

            if (i < arr.length - 1) {
              this.sb.appendLine(',');
            } else {
              this.sb.appendLine();
            }
          }

        });
      } else {
        this.indent(`  ...    // ${arr.length} items`);
        this.sb.appendLine();
      }

      this.indent(`]`);

    } else if (Types.isObject(value)) {
      this.sb.append(`{`);
      if (this.options.showInfo) {
        if (!Types.isPresent(value.constructor)) {
          this.sb.append(`    // value.constructor === null`);
        } else {
          this.sb.append(`    // ${value.constructor.name}`);
        }
      }
      this.sb.appendLine();


      if (this.indenter.Counter <= this.options.maxDepth) {
        super.iterateOnEntries(value, undefined,
          (count, index, entryName, entryValue, clonedEntryName, clonedEntryValue) => {
            using(new Suspender([this.indenter]), () => {
              const entryValueReplaced = this.replacer.replace(value, entryName, entryValue);

              this.dumpRec(entryValueReplaced, entryName);   // Rekursion

              if (index < count - 1) {
                this.sb.appendLine(',');
              } else {
                this.sb.appendLine();
              }

            });
          });
      } else {
        this.indent('  ...');
        this.sb.appendLine();
      }

      this.indent('}');
    }
  }

  private indent(text: string = '') {
    // this.sb.appendLine();
    this.sb.append(this.indenter.getIndentation());
    this.sb.append(text);
  }
}


// tslint:disable-next-line:max-classes-per-file
export class JsonDumper {

  public static DEFAULT_REPLACER = new NopValueReplacer();

  public static DEFAULT_OPTIONS: IJsonDumperOptions = {
    maxDepth: Number.MAX_VALUE,
    showInfo: true
  };

  /**
   * Gibt das Objekt @param{value} als String aus.
   *
   * @static
   * @template T
   * @param {T} value
   * @param {number} maxDepth - max. Rekursionstiefe für die Ausgabe [default: unbegrenzt]
   * @returns {T} allowCycles -
   *
   * @memberOf Clone
   */
  public static stringify<T>(value: T, options?: IJsonDumperOptions): string {
    const valueReplacer = CoreInjector.instance.getInstance<IValueReplacer>(VALUE_REPLACER,
      JsonDumper.DEFAULT_REPLACER);

    if (!options) {
      options = JsonDumper.DEFAULT_OPTIONS;
    } else {
      if (!Types.isPresent(options.maxDepth)) {
        options.maxDepth = JsonDumper.DEFAULT_OPTIONS.maxDepth;
      }
      if (!Types.isPresent(options.showInfo)) {
        options.showInfo = JsonDumper.DEFAULT_OPTIONS.showInfo;
      }
    }

    const dumper = new DumperInternal(valueReplacer, options);
    dumper.dump<T>(value);

    return dumper.toString();
  }
}