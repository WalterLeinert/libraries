import { Serializable } from '../serialization/serializable.decorator';
import { BooleanTerm } from './boolean-term';
import { UnaryTerm } from './unary-term';

@Serializable()
export class NotTerm extends UnaryTerm {
  constructor(term: BooleanTerm) {
    super(term);
  }
}