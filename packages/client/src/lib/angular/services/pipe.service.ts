import { CurrencyPipe, DatePipe, DecimalPipe, LowerCasePipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { Injectable, /* LOCALE_ID, */ PipeTransform } from '@angular/core';

import { Assert, Dictionary, NotSupportedException, Tuple } from '@fluxgate/core';

/**
 * z.Zt. verfügbare Pipes
 */
export type PipeType = 'date' | 'decimal' | 'percent' | 'currency' | 'uppercase' | 'lowercase';


export class PipeTypes {
  public static readonly DATE: PipeType = 'date';
  public static readonly DECIMAL: PipeType = 'decimal';
  public static readonly CURRENCY: PipeType = 'currency';
  public static readonly PERCENT: PipeType = 'percent';
  public static readonly UPPERCASE: PipeType = 'uppercase';
  public static readonly LOWERCASE: PipeType = 'lowercase';
}



/**
 * Service, der Standardpipes über ein Dictionary zur Verfügung stellt.
 */
// tslint:disable-next-line:max-classes-per-file
@Injectable({
  providedIn: 'root'
})
export class PipeService {
  // private static readonly DEFAULT_LOCALE = LOCALE_ID ? LOCALE_ID.toString() : 'XX';  // TODO
  private static pipeDict: Dictionary<Tuple<PipeType, string>, PipeTransform> =
    new Dictionary<Tuple<PipeType, string>, PipeTransform>();

  private _locale: string = 'de-de';

  // tslint:disable-next-line:no-empty
  constructor() { }


  /**
   * Liefert die Pipe für @param{pipe} und die Locale @param{locale}. Ist für das Tupel
   * noch keine Pipe registriert, wird dies dann durchgeführt.
   *
   * @param pipe
   * @param [locale=this._locale]
   *
   * @memberOf PipeService
   */
  public getPipe(pipe: PipeType, locale: string = this._locale): PipeTransform {
    Assert.notNullOrEmpty(pipe);
    const tuple = new Tuple<PipeType, string>(pipe, locale);

    if (!this.hasPipe(pipe, locale)) {
      switch (pipe) {
        case PipeTypes.CURRENCY:
          PipeService.pipeDict.set(tuple, new CurrencyPipe(locale));
          break;
        case PipeTypes.DATE:
          PipeService.pipeDict.set(tuple, new DatePipe(locale));
          break;
        case PipeTypes.DECIMAL:
          PipeService.pipeDict.set(tuple, new DecimalPipe(locale));
          break;
        case PipeTypes.PERCENT:
          PipeService.pipeDict.set(tuple, new PercentPipe(locale));
          break;
        case PipeTypes.LOWERCASE:
          PipeService.pipeDict.set(tuple, new LowerCasePipe());
          break;
        case PipeTypes.UPPERCASE:
          PipeService.pipeDict.set(tuple, new UpperCasePipe());
          break;
        default:
          throw new NotSupportedException(`Unsupported pipe type: ${pipe}, locale = ${locale}`);
      }

    }

    return PipeService.pipeDict.get(tuple);
  }



  /**
   * Liefert true, falls die Pipe @param{pipe} und dem Locale @param{locale} bereits registriert ist.
   *
   * @param pipe
   * @param [locale=this._locale]
   *
   * @memberOf PipeService
   */
  private hasPipe(pipe: PipeType, locale: string = this._locale): boolean {
    Assert.notNullOrEmpty(pipe);

    const tuple = new Tuple<PipeType, string>(pipe, locale);
    return PipeService.pipeDict.containsKey(tuple);
  }

}