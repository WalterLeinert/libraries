import { IPrinterTray } from './printertray.interface';
import { IPrinter } from './printer.interface';

export class Printer implements IPrinter {
  
  constructor (public name: string, public orientation?: string, public type?: string, public state?: string, public status?: string, 
    public resolution?: string, public papersize?: string, public paperwidth?: number, public paperheight?: number, public printablewidth?: number,
    public printableheight?: number, public copies?: number, public canrendercopies?: boolean, public currenttray?: string, 
    public defaulttray?: string, public trays?: IPrinterTray[]) {

    }
}