import { Injector, Provider, ReflectiveInjector } from 'injection-js';

import { using } from '../base/disposable';
import { StringBuilder } from '../base/stringBuilder';
import { Indenter } from '../suspendable/indenter';
import { Suspender } from '../suspendable/suspender';
import { Types } from '../types/types';

class InjectorDumperInternal {
  private indenter: Indenter = new Indenter();
  private sb: StringBuilder = new StringBuilder();

  public stringify(injector: ReflectiveInjector, prefix?: string) {
    // this.indentLine('{');
    this.indent();
    if (!Types.isNullOrEmpty(prefix)) {
      this.sb.append(prefix);
    }
    this.sb.appendLine(injector.toString());

    if (injector.parent) {
      using(new Suspender([this.indenter]), () => {
        // this.sb.appendLine();
        this.stringify(injector.parent as ReflectiveInjector, '--> ');
      });
    }
    // this.indentLine('}');
  }

  public toString() {
    return this.sb.toString();
  }

  protected indent(text: string = '') {
    // this.sb.appendLine();
    this.sb.append(this.indenter.getIndentation());
    this.sb.append(text);
  }

  protected indentLine(text: string = '') {
    this.indent(text);
    this.sb.appendLine();
  }
}


// tslint:disable-next-line:max-classes-per-file
export class InjectorDumper {

  public static stringify(injector: ReflectiveInjector): string {
    const dumper = new InjectorDumperInternal();
    dumper.stringify(injector);
    return dumper.toString();
  }
}