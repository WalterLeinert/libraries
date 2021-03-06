import { Injectable, Injector, OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';


// -------------------------------------- logging --------------------------------------------
import { using } from '../base/disposable';
import { levels } from '../diagnostics/level';
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { XLogInternal } from '../diagnostics/xlog-internal';
// -------------------------------------- logging --------------------------------------------

import { Assertion } from '../base/assertion';
import { Funktion } from '../base/objectType';
import { Types } from '../types/types';
import { ComponentMetadata } from './component-metadata';
import { InjectorBase } from './injector-base';
import { ModuleMetadataStorage } from './module-metadata-storage';


/**
 * Hilfsklasse als Singleton mit root injector für dependency injection.
 *
 * Erst nach mindestens einem Aufruf von resolveAndCreate können Instanzen
 * dann über @see{getInstance} erhalten werden.
 *
 * @export
 * @class CoreInjector
 */
@Injectable()
export class CoreInjector extends InjectorBase<Injector, OpaqueToken> {
  protected static readonly logger = getLogger(CoreInjector);

  public static readonly instance = new CoreInjector();

  private compMetadata: ComponentMetadata;

  private constructor() {
    super();
    // ok
  }


  public getInstance<TInstance>(token: Funktion | OpaqueToken | any, notFoundValue?: any): TInstance {
    return using(new XLogInternal(CoreInjector.logger, levels.INFO, 'getInstance',
      `token = ${token}, notFoundValue = ${notFoundValue}`), (log) => {

        if (!this.getInjector() && Types.isPresent(notFoundValue)) {
          // tslint:disable-next-line:no-console
          console.warn(
            `CoreInjector.getInstance: token = ${token}: using notFoundValue = ${JSON.stringify(notFoundValue)}`);
          return notFoundValue;     // v.a. für Unittests und deren Initialisierung
        }
        return this.getInjector().get(token, notFoundValue) as TInstance;
      });
  }

  public getInjector(): ReflectiveInjector {
    return super.getInjector() as ReflectiveInjector;
  }

  protected onResolveAndCreate(providers: Provider[], parent?: Injector): Injector {
    let injector = parent;

    if (!Types.isPresent(injector)) {
      injector = this.getInjector();
      if (!injector) {
        throw new Error(`injector is null`);
      }
    } else {
      injector = (injector as ReflectiveInjector).resolveAndCreateChild(providers);
    }

    return injector;
  }
}