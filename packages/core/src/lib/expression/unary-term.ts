import { Serializable } from '../serialization/serializable.decorator';
import { BooleanTerm } from './boolean-term';

@Serializable()
export class UnaryTerm extends BooleanTerm {
  constructor(term?: BooleanTerm) {
    super(term, undefined);
  }

  public get term(): BooleanTerm {
    return this.left as BooleanTerm;
  }
}
