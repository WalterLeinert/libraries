export interface IEqualityComparer<T> {
    equals(x: T, y: T): boolean;
    getHashCode(obj: T): number;
}
