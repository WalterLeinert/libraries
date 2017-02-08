// Angular
import { PipeTransform } from '@angular/core';

import { ControlType } from './../angular/modules/common/controlType';
import { PipeType } from './../angular/services/pipe.service';

import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { DataType, DataTypes } from './dataType';
import { DisplayInfo } from './displayInfo';
import { TextAlignment, TextAlignments } from './textAlignment';

export class ControlDisplayInfo extends DisplayInfo implements IControlDisplayInfo {

    public static DEFAULT: IControlDisplayInfo = new ControlDisplayInfo(
        DisplayInfo.CURRENT_ITEM,
        DisplayInfo.CURRENT_ITEM,
        undefined,
        undefined,
        TextAlignments.LEFT,
        ControlType.Input
    );


    public static isRightAligned(dataType: DataType) {
        switch (dataType) {
            case DataTypes.NUMBER:
            case DataTypes.DATE:
            case DataTypes.TIME:
                return true;
            default:
                return false;
        }
    }


    constructor(textField?: string, valueField?: string, dataType?: DataType, private _style?: string,
        private _textAlignment?: TextAlignment,
        private _controlType: ControlType = ControlType.Input,
        private _selectorDataService?: Function, private _pipe?: PipeType | PipeTransform,
        private _pipeArgs?: string, private _pipeLocale?: string) {
        super(textField, valueField, dataType);
    }

    public get controlType(): ControlType {
        return this._controlType;
    }

    public get selectorDataService(): Function {
        return this._selectorDataService;
    }

    public get style(): string {
        return this._style;
    }

    public get textAlignment(): TextAlignment {
        return this._textAlignment;
    }

    public get pipe(): PipeType | PipeTransform {
        return this._pipe;
    }

    public get pipeArgs(): string {
        return this._pipeArgs;
    }

    public get pipeLocale(): string {
        return this._pipeLocale;
    }
}