import { Types } from '../types/types';
import { Assert } from './../util/assert';
import { StringBuilder } from './stringBuilder';

/**
 * String Utilities
 */
export class StringUtil {

  /**
   * Ändert den String @param{text}, indem ein Textbereich entfernt wird und/oder ein
   * neuer String eingefügt wird
   *
   * @static
   * @param {string} text - der zu modifiziernede String
   * @param {number} start - Index, ab dem der String @{text} geändert wird
   * @param {number} delCount - Anzahl der zu entfernenden Zeichen in @param{text} ab @param{start}
   * @param {string} textToInsert - einzufügender Text
   * @returns {string} der neue String
   *
   * @memberOf StringUtil
   */
  public static splice(text: string, start: number, delCount: number, textToInsert?: string): string {
    Assert.notNull(text);
    Assert.that(start >= 0 && start <= text.length);
    Assert.that(delCount >= 0 && delCount <= text.length);
    Assert.that(start + delCount <= text.length);
    // Assert.notNullOrEmpty(textToInsert);
    const sb = new StringBuilder();

    sb.append(text.slice(0, start));
    if (textToInsert) {
      sb.append(textToInsert);
    }

    if (delCount) {
      sb.append(text.slice(start + delCount));
    } else {
      sb.append(text.slice(start));
    }

    return sb.toString();
  }


  /**
   * Erzeugt einen JSON-ähnlichen String, dem Typnamen von @param{obj} und den Argumenten @param{args}
   *
   * @static
   * @param {Object} obj
   * @param {...any[]} args
   * @returns
   *
   * @memberof StringUtil
   */
  public static enclose(obj: Object | string, ...args: any[]) {
    const sb = new StringBuilder('{ ');
    if (Types.isString(obj)) {
      sb.append(obj as string);
    } else {
      sb.append(obj.constructor.name);
    }

    if (!Types.isNullOrEmpty(args)) {
      sb.append(`: `);
      sb.append(`${args}`);
    }

    sb.append(' }');

    return sb.toString();
  }

  /**
   * Erzeugt einen interpolierten String für die Argumente @param{args}
   *
   * @static
   * @param {...any[]} args
   * @returns
   *
   * @memberof StringUtil
   */
  public static format(...args: any[]) {
    return `${args}`;
  }

}