import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { DisplayInfo } from './displayInfo';
import { ControlType } from './../angular/modules/common/controlType';

export class ControlDisplayInfo extends DisplayInfo implements IControlDisplayInfo {

    public static DEFAULT: IControlDisplayInfo = new ControlDisplayInfo(
        DisplayInfo.CURRENT_ITEM,
        DisplayInfo.CURRENT_ITEM,
        ControlType.Input
    );

    constructor(textField?: string, valueField?: string, private _controlType?: ControlType, private _style?: string) {
        super(textField, valueField);
    }

    public get controlType(): ControlType {
        return this._controlType;
    }

    public get style(): string {
        return this._style;
    }
}