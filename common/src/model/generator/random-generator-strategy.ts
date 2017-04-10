export class RandomGeneratorStrategy implements Iterator<number>  {
  private index = 0;

  /**
   * Creates an instance of RandomGeneratorStrategy.
   *
   * @param {number} start - erster Wert
   * @param {number} count - Anzahl zu generierender zufälliger Werte
   *
   * @memberOf RandomGeneratorStrategy
   */
  constructor(private start: number, private count: number) {
  }

  public next(): IteratorResult<number> {
    if (this.index < this.count) {
      const index = Math.floor(Math.random() * this.count);
      return {
        done: false,
        value: this.start + index
      };

    } else {
      return {
        done: true,
        value: undefined
      };
    }
  }
}