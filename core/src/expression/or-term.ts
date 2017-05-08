import { JsonClass } from '../serialization/decorator';
import { BinaryTerm } from './binary-term';
import { BooleanTerm } from './boolean-term';

@JsonClass()
export class OrTerm extends BinaryTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}
