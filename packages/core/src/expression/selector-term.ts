import { Serializable } from '../serialization/serializable.decorator';
import { IAttributeSelector } from './attributeSelector.interface';
import { UnaryTerm } from './unary-term';

@Serializable()
export class SelectorTerm extends UnaryTerm {
  constructor(private _selector: IAttributeSelector) {
    super();
  }

  public get selector(): IAttributeSelector {
    return this._selector;
  }
}