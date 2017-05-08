import { JsonClass } from '../serialization/decorator';
import { IAttributeSelector } from './attributeSelector.interface';
import { UnaryTerm } from './unary-term';

@JsonClass()
export class SelectorTerm extends UnaryTerm {
  constructor(private _selector: IAttributeSelector) {
    super();
  }

  public get selector(): IAttributeSelector {
    return this._selector;
  }
}