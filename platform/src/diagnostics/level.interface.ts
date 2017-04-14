export interface ILevel {
    isEqualTo(other: string | ILevel): boolean;
    isLessThanOrEqualTo(other: string | ILevel): boolean;
    isGreaterThanOrEqualTo(other: string | ILevel): boolean;
    toString(): string;
}