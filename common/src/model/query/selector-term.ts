import { UnaryTerm } from '@fluxgate/core';

import { IAttributeSelector } from './attributeSelector.interface';


export class SelectorTerm extends UnaryTerm {
  constructor(private _selector: IAttributeSelector) {
    super();
  }

  public get selector(): IAttributeSelector {
    return this._selector;
  }
}