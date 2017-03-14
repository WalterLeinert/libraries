// Angular
import { PipeTransform } from '@angular/core';

import { ControlType } from './../../angular/modules/common/controlType';
import { PipeType } from './../../angular/services/pipe.service';
import { IControlDisplayInfo } from './controlDisplayInfo.interface';
import { DataType, DataTypes } from './dataType';
import { DisplayInfo } from './displayInfo';
import { IEnumDisplayInfo } from './enumDisplayInfo.interface';
import { TextAlignment, TextAlignments } from './textAlignment';

export class ControlDisplayInfo extends DisplayInfo implements IControlDisplayInfo {

  public static DEFAULT: IControlDisplayInfo = new ControlDisplayInfo(
    {
      textField: DisplayInfo.CURRENT_ITEM,
      valueField: DisplayInfo.CURRENT_ITEM,
      editable: DisplayInfo.DEFAULT.editable,
      textAlignment: TextAlignments.LEFT,
      controlType: ControlType.Input
    }
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

  constructor(private controlOptions: IControlDisplayInfo) {
    super({
      textField: controlOptions.textField,
      valueField: controlOptions.valueField,
      dataType: controlOptions.dataType,
      editable: controlOptions.editable,
      color: controlOptions.color
    });
  }


  public get controlType(): ControlType {
    return this.controlOptions.controlType;
  }

  public get enumInfo(): IEnumDisplayInfo {
    return this.controlOptions.enumInfo;
  }

  public get style(): string {
    return this.controlOptions.style;
  }

  public get textAlignment(): TextAlignment {
    return this.controlOptions.textAlignment;
  }

  public get pipe(): PipeType | PipeTransform {
    return this.controlOptions.pipe;
  }

  public get pipeArgs(): string {
    return this.controlOptions.pipeArgs;
  }

  public get pipeLocale(): string {
    return this.controlOptions.pipeLocale;
  }
}