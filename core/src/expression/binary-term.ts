import { JsonClass } from '../serialization/decorator';
import { BooleanTerm } from './boolean-term';

@JsonClass()
export class BinaryTerm extends BooleanTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}