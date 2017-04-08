import { Injectable } from '@angular/core';

import { IIdGenerator } from './id-generator.interface';

@Injectable()
export class NumberIdGeneratorService implements IIdGenerator<number> {
  private static _id = 0;

  public next(): number {
    return NumberIdGeneratorService._id++;
  }
}