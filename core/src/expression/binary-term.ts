import { BooleanTerm } from './boolean-term';

export class BinaryTerm extends BooleanTerm {
  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }
}