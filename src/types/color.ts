import * as TinyColor from 'tinycolor2';

import { Dictionary } from './dictionary';
import { byte } from './types';

export type ColorType = string | IRGB;

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
// tslint:disable-next-line:max-classes-per-file
export class Color {
  private static colorDict: Dictionary<string, Color> = new Dictionary<string, Color>(); 
  private color: tinycolorInstance;

  /**
   * Creates an instance of Color.
   * 
   * @param {(string | IRGB)} color
   * 
   * @memberOf Color
   */
  private constructor(color: ColorType) {
    if (typeof color === 'string') {
      this.color = TinyColor(color);
    } else {
      this.color = TinyColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
    }

  }

  /**
   * Creates an instance of Color and holds a cache of colors
   * 
   * @static
   * @param {ColorType} color
   * @returns
   * 
   * @memberOf Color
  
   */
  public static from(color: ColorType) {
    if (typeof color === 'string') {
      let thisColor: Color;
      if (Color.colorDict.containsKey(color)) {
        thisColor = Color.colorDict.get(color);
      } else {
        thisColor = new Color(color);
        Color.colorDict.set(color, thisColor);
      }
      return thisColor;    
    } else {
      return new Color(color);
    }
  }

  public toString(): string {
    return this.color.toString();
  }

}