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
        DisplayInfo.CURRENT_ITEM,
        DisplayInfo.CURRENT_ITEM);

    constructor(private _textField?: string, private _valueField?: string, private _dataType?: DataType) {
    }

    public get textField(): string {
        return this._textField;
    }

    public get valueField(): string {
        return this._valueField;
    }

    public get dataType(): DataType {
        return this._dataType;
    }
}