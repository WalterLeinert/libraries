export interface IValueGenerator {
  next(): IteratorResult<any>;
}