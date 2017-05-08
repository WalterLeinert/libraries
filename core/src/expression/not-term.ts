import { JsonClass } from '../serialization/decorator';
import { BooleanTerm } from './boolean-term';
import { UnaryTerm } from './unary-term';

@JsonClass()
export class NotTerm extends UnaryTerm {
  constructor(term: BooleanTerm) {
    super(term);
  }
}