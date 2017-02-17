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
      valueField: DisplayInfo.CURRENT_ITEM
    }
  );

  constructor(private options: IDisplayInfo) {
  }

  public get textField(): string {
    return this.options.textField;
  }

  public get valueField(): string {
    return this.options.valueField;
  }

  public get color(): string {
    return this.options.color;
  }

  public get dataType(): DataType {
    return this.options.dataType;
  }
}