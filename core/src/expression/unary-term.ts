import { BooleanTerm } from './boolean-term';

export class UnaryTerm extends BooleanTerm {
  constructor(term?: BooleanTerm) {
    super(term, undefined);
  }

  public get term(): BooleanTerm {
    return this.left as BooleanTerm;
  }
}
