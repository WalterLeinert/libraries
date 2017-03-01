import { IPrintOptions } from './printOptions.interface';

export class PrintOptions implements IPrintOptions {

  constructor(public title: string, public docSize?: string, public printer?: string, public copies: number = 1,
    public color: boolean = false) {

  }
}
