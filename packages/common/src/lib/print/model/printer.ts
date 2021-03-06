import { Serializable } from '@fluxgate/core';

import { PaperOrientation } from './paper-orientation';
import { IPrinter } from './printer.interface';
import { IPrinterTray } from './printerTray.interface';

@Serializable()
export class Printer implements IPrinter {

  constructor(public name: string, public orientation?: PaperOrientation, public type?: string, public state?: string,
    public status?: string, public resolution?: string, public papersize?: string, public paperwidth?: number,
    public paperheight?: number, public printablewidth?: number, public printableheight?: number,
    public copies?: number, public canrendercopies?: boolean, public currenttray?: string,
    public defaulttray?: string, public trays?: IPrinterTray[]) {

  }
}