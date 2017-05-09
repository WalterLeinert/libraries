import { Serializable } from '../serialization/serializable.decorator';
import { BooleanTerm } from './boolean-term';

@Serializable()
export class BinaryTerm extends BooleanTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}