export interface IValueGenerator {
  next(): IteratorResult<any>;
  current(): any;
}