import { BooleanTerm } from './boolean-term';
import { UnaryTerm } from './unary-term';

export class NotTerm extends UnaryTerm {
  constructor(term: BooleanTerm) {
    super(term);
  }
}