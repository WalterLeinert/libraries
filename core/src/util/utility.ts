export class Utility {

  /**
   * Liefert eine Hashcode für den String @param{text}
   *
   * http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   *
   * @static
   * @param {string} text
   * @returns {number}
   *
   * @memberOf Utility
   */
  public static hashCodeForString(text: string): number {
    let hash = 0;

    if (text.length === 0) {
      return hash;
    }

    const len = text.length;
    for (let i = 0; i < len; i++) {
      const chr = text.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      hash = ((hash << 5) - hash) + chr;
      // tslint:disable-next-line:no-bitwise
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }


  /**
   * Liefert true, falls @param {value} null oder leer ist.
   */
  public static isNullOrEmpty<T extends { length: number }>(value: T) {
    return (!value || value == null || value.length <= 0);
  }


  //
  // Set-Operationen
  //

  public static toArray<T>(set: Set<T>): T[] {
    return [...Array.from<T>(set)];
  }

  public static intersect<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    return new Set(Utility.toArray(set1).filter((x) => set2.has(x)));
  }

  public static difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    return new Set(Utility.toArray(set1).filter((x) => !set2.has(x)));
  }

  public static union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
    return new Set([...Utility.toArray(set1), ...Utility.toArray(set2)]);
  }
}