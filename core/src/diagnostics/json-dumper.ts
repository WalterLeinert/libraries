import { ClonerBase } from '../base/clone';
import { using } from '../base/disposable';
import { Funktion } from '../base/objectType';
import { StringBuilder } from '../base/stringBuilder';
import { Indenter } from '../suspendable/indenter';
import { Suspender } from '../suspendable/suspender';
import { Dictionary } from '../types/dictionary';
import { Types } from '../types/types';


class DumperInternal<T> extends ClonerBase<T> {
  private indenter: Indenter = new Indenter();
  private sb: StringBuilder = new StringBuilder();

  /**
   * Verifiziert, dass @param{clonedValue} wirklich ein deep clone von @param{value} ist.
   */
  public dump<T>(value: T, attrName?: string) {
    if (!Types.isNullOrEmpty(attrName)) {
      this.indent(`${attrName}: `);
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
        this.sb.append('\'');
      }

      this.sb.append(`${value}`);

      if (Types.isString(value)) {
        this.sb.append('\'');
      }

      return;
    }


    let cycleDetected = false;

    if (this.checkCycles) {
      if (Dictionary.isValidKey(value)) {
        // clone bereits erzeugt und registriert?
        const obj = super.getRegisteredObject(value);
        if (obj) {
          cycleDetected = true;

          this.indent(`  ----> cycle detected: type = ${obj.constructor.name}`);

          return;
        }

        // Objekt für Zykluserkennung registrieren, aber nur falls unser Dictionary dies unterstützt
        super.registerObjectFor(value, value);
      }
    }


    if (Types.isArray(value)) {
      const arr = value as any as any[];
      this.sb.appendLine(`[`);

      using(new Suspender([this.indenter]), () => {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          this.indent();

          this.dump(arr[i]);

          if (i < arr.length - 1) {
            this.sb.appendLine(',');
          } else {
            this.sb.appendLine();
          }
        }

      });

      this.indent(`]`);

    } else if (Types.isObject(value)) {
      this.sb.appendLine(`{    // ${value.constructor.name}`);

      // geklonte vordefinierte Typen sind ok
      const predefCloner = ClonerBase.getPredefinedClonerFor(((value.constructor) as any as Funktion).name);
      if (predefCloner !== undefined) {
        return;
      }

      super.iterateOnEntries(value, undefined,
        (count, index, entryName, entryValue, clonedEntryName, clonedEntryValue) => {
          using(new Suspender([this.indenter]), () => {
            this.dump(entryValue, entryName);   // Rekursion

            if (index < count - 1) {
              this.sb.appendLine(',');
            } else {
              this.sb.appendLine();
            }

          });
        });

      this.indent('}');
    }
  }


  public toString(): string {
    return this.sb.toString();
  }


  private indent(text: string = '') {
    // this.sb.appendLine();
    this.sb.append(this.indenter.getIndentation());
    this.sb.append(text);
  }

  private indentLine(text: string) {
    this.indent(text);
    this.sb.appendLine();
  }
}



// tslint:disable-next-line:max-classes-per-file
export class JsonDumper {

  /**
   * Gibt das Objekt @param{value} als String aus.
   *
   * @static
   * @template T
   * @param {T} value
   * @returns {T}
   *
   * @memberOf Clone
   */
  public static stringify<T>(value: T, allowCycles: boolean = true): string {
    const dumper = new DumperInternal<T>(allowCycles);
    dumper.dump<T>(value);

    return dumper.toString();
  }
}