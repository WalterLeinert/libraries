import { Serializable } from '../serialization/serializable.decorator';
import { BinaryTerm } from './binary-term';
import { BooleanTerm } from './boolean-term';

@Serializable()
export class AndTerm extends BinaryTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}
