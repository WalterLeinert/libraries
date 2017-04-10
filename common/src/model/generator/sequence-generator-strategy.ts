import { InvalidOperationException } from '../../exceptions/invalidOperationException';

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
    const index = this.index++;

    if (this.index < this.count) {
      return {
        done: false,
        value: this.start + (index * this.increment)
      };

    } else if (index === this.count) {
      return {
        done: true,
        value: undefined
      };
    } else {
      throw new InvalidOperationException(`no next value: index = ${this.index} -- count = ${this.count}`);
    }
  }
}