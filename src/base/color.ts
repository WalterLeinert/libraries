import { PipeTransform } from '@angular/core';
import * as TinyColor from 'tinycolor2';

export type byte = number;
export type ColorType = string | IRGB;

export type Converter<T, TResult> = ((object: T) => TResult);

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
// tslint:disable-next-line:max-classes-per-file
export class Color {
  private color: tinycolorInstance;

  /**
   * Creates an instance of Color.
   * 
   * @param {(string | IRGB)} color
   * 
   * @memberOf Color
   */
  constructor(color: ColorType) {

    if (typeof color === 'string') {
      this.color = TinyColor(color);
    } else {
      this.color = TinyColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
    }

  }

  public toString(): string {
    return this.color.toString();
  }

}