export class SequenceGeneratorStrategy implements Iterator<number>  {
  private index = 0;

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
    if (this.index < this.count) {
      const index = this.index++;
      return {
        done: false,
        value: this.start + (index * this.increment)
      };

    } else {
      return {
        done: true,
        value: undefined
      };
    }
  }
}