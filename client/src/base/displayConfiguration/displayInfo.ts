// Fluxgate
import { Color, InstanceAccessor } from '@fluxgate/common';

import { DataType } from './dataType';
import { IDisplayInfo } from './displayInfo.interface';

export class DisplayInfo implements IDisplayInfo {

  /**
   * symbolischer Propertyname: bezieht sich auf das aktuelle Item:
   * - bei Primitiven (wie string[]) auf den einzelnen Wert der Liste
   * - bei Objekten (wie Person[]) auf die einzelne Objektinstanz
   */
  public static CURRENT_ITEM = '.';

  public static DEFAULT: IDisplayInfo = new DisplayInfo(
    {
      textField: DisplayInfo.CURRENT_ITEM,
      valueField: DisplayInfo.CURRENT_ITEM,
      editable: true,
      required: false
    }
  );

  constructor(private options: IDisplayInfo) {
  }

  public get textField(): string {
    return this.options.textField;
  }

  public set textField(value: string) {
    this.options.textField = value;
  }

  public get valueField(): string {
    return this.options.valueField;
  }

  public set valueField(value: string) {
    this.options.valueField = value;
  }

  public get editable(): boolean {
    return this.options.editable;
  }

  public get color(): Color | InstanceAccessor<any, Color> {
    return this.options.color;
  }

  public get dataType(): DataType {
    return this.options.dataType;
  }

  public get required(): boolean {
    return this.options.required;
  }
}