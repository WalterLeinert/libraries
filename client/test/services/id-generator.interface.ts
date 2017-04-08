export interface IIdGenerator<TId> {
  next(): TId;
}