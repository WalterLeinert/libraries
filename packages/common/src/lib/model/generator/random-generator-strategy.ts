export class RandomGeneratorStrategy implements Iterator<number>  {
  private counter = 0;

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
    const counter = this.counter++;

    if (counter < this.count - 1) {
      const index = Math.floor(Math.random() * this.count);
      return {
        done: false,
        value: this.start + index
      };

    } else if (counter === this.count - 1) {
      return {
        done: true,
        value: undefined
      };
    }
  }
}