import { byte } from './types';
export declare type ColorType = string | IRGB;
/**
 * Modelliert RGB-Farbinformation
 *
 * @export
 * @interface IRGB
 */
export interface IRGB {
    r: byte;
    g: byte;
    b: byte;
}
/**
 * Modelliert eine Farbe.
 *
 * @export
 * @class Color
 */
export declare class Color {
    private static colorDict;
    private _color;
    /**
     * Creates an instance of Color.
     *
     * @param {(string | IRGB)} color
     *
     * @memberOf Color
     */
    private constructor(color);
    /**
     * Creates an instance of Color and holds a cache of colors
     *
     * @static
     * @param {ColorType} color
     * @returns
     *
     * @memberOf Color
     */
    static from(color: ColorType): Color;
    toString(): string;
}
