export class SequenceGeneratorStrategy implements Iterator<number>  {
  private counter = 0;

  /**
   * Creates an instance of SequenceGeneratorStrategy.
   *
   * @param {number} start - erster Wert
   * @param {number} count - Anzahl zu generierender Werte
   * @param {number} [increment=1] - Abstand der generierten Werte
   *
   * @memberOf SequenceGeneratorStrategy
   */
  constructor(private count: number, private start: number = 1, private increment: number = 1) {
  }

  public next(): IteratorResult<number> {
    const counter = this.counter++;

    if (counter < this.count) {
      return {
        done: false,
        value: this.start + (counter * this.increment)
      };

    } else if (counter === this.count) {
      return {
        done: true,
        value: undefined
      };
    }
  }
}