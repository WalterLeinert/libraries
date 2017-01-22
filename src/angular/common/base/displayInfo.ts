import { IDisplayInfo } from './displayInfo.interface';

export class DisplayInfo {

    /**
      * symbolischer Propertyname: bezieht sich auf das aktuelle Item:
      * - bei Primitiven (wie string[]) auf den einzelnen Wert der Liste
      * - bei Objekten (wie Person[]) auf die einzelne Objektinstanz
      */
    public static CURRENT_ITEM = '.';

    public static DEFAULT: IDisplayInfo = {
        textField: DisplayInfo.CURRENT_ITEM,
        valueField: DisplayInfo.CURRENT_ITEM,
    };
}