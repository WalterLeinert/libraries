import { VisitableNode } from '../pattern/visitor/visitable-node';
import { JsonClass } from '../serialization/decorator';

@JsonClass()
export class BooleanTerm extends VisitableNode {

  constructor(left: BooleanTerm, right: BooleanTerm) {
    super(left, right);
  }


  public get leftTerm(): BooleanTerm {
    return this.left as BooleanTerm;
  }

  public get rightTerm(): BooleanTerm {
    return this.right as BooleanTerm;
  }
}
