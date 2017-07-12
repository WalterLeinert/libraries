import { OpaqueToken, Provider, ReflectiveInjector } from 'injection-js';

import { Funktion } from '../base/objectType';
import { ClassMetadata } from '../metadata/class-metadata';
import { IVisitable } from '../pattern/visitor/visitable.interface';
import { IVisitor } from '../pattern/visitor/visitor.interface';
import { Types } from '../types/types';
import { IComponentOptions } from './component-options.interface';

export interface IGetter<TReturn, T> {
  get(t: T, optional?: any): TReturn;
}

/**
 * abstrakte Basisklasse für dependency injection (DI) Metadaten
 *
 * @export
 * @abstract
 * @class DiMetadata
 * @extends {ClassMetadata}
 * @implements {IVisitable<DiMetadata>}
 */
export abstract class DiMetadata extends ClassMetadata
  implements IVisitable<DiMetadata> {

  /**
   * Der Klassenname einer Instanz vom Typ @see{ReflectiveInjector}
   * Hinweis: instanceof funktioniert nicht, da Basisklasse abstrakt.
   */
  public static readonly INJECTOR_CLASSNAME = 'ReflectiveInjector_';

  private _providers: Provider[] = [];
  private _injector: ReflectiveInjector;


  protected constructor(target: Funktion, providers: Provider[]) {
    super(target );

    if (providers) {
      this._providers = [...providers];
    }
  }

  /**
   * Die Provider der Metadaten
   *
   * @readonly
   * @type {Provider[]}
   * @memberof DiMetadata
   */
  public get providers(): Provider[] {
    return this._providers;
  }

  /**
   * Erzeugt einen Injector für die @param{providers} und den Parent-Injector @param{parent}.
   * Ist @param{parent} angegeben, so wird zu diesem Injector ein Child-Injector erzeugt -> Hierarchie.
   *
   * @param {Provider[]} providers
   * @param {ReflectiveInjector} [parent=null]
   * @returns {ReflectiveInjector}
   * @memberof DiMetadata
   */
  public createInjector(providers: Provider[], parent: ReflectiveInjector = null): ReflectiveInjector {
    let injector;
    const resolvedProviders = ReflectiveInjector.resolve(providers);
    if (Types.isPresent(parent)) {
      injector = parent.createChildFromResolved(resolvedProviders);
    } else {
      injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
    }
    this._injector = injector;
    return injector;
  }

  /**
   * Erzeugt eine Instanz vom Typ @template{TInstance} für das Token @param{token} und den
   * Defaultwert @param{notFoundValue}.
   *
   * @template TInstance
   * @param {(Funktion | OpaqueToken | any)} token
   * @param {*} [notFoundValue]
   * @returns {TInstance}
   * @memberof DiMetadata
   */
  public getInstance<TInstance>(token: Funktion | OpaqueToken | any, notFoundValue?: any): TInstance {
    return this.injector.get(token, notFoundValue) as TInstance;
  }

  /**
   * Accept-Methode für Visitor-Pattern
   *
   * @param {IVisitor<DiMetadata>} visitor
   * @memberof DiMetadata
   */
  public accept(visitor: IVisitor<DiMetadata>) {
    visitor.visit(this);
  }

  // TODO: obsolete?
  private resolveAndCreate(providers: Provider[], parent?: ReflectiveInjector): ReflectiveInjector {
    let injector = parent;

    if (!Types.isPresent(injector)) {
      injector = ReflectiveInjector.resolveAndCreate(providers);    // Root-Injector
    } else {
      injector = injector.resolveAndCreateChild(providers);
    }

    return injector;
  }

  /**
   * Liefert den zugehörigen Injector.
   *
   * @readonly
   * @type {ReflectiveInjector}
   * @memberof DiMetadata
   */
  public get injector(): ReflectiveInjector {
    return this._injector;
  }
}