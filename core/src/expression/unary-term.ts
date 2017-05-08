import { JsonClass } from '../serialization/decorator';
import { BooleanTerm } from './boolean-term';

@JsonClass()
export class UnaryTerm extends BooleanTerm {
  constructor(term?: BooleanTerm) {
    super(term, undefined);
  }

  public get term(): BooleanTerm {
    return this.left as BooleanTerm;
  }
}
