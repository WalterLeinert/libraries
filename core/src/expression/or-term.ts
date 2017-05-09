import { Serializable } from '../serialization/serializable.decorator';
import { BinaryTerm } from './binary-term';
import { BooleanTerm } from './boolean-term';

@Serializable()
export class OrTerm extends BinaryTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}
