import { PaperOrientation } from './paper-orientation';
import { IPrinterTray } from './printerTray.interface';

/**
 * Druckerinfos
 *
 * @export
 * @interface IPrinter
 */
export interface IPrinter {
  /**
   * Name des Druckers
   *
   * @type {string}
   * @memberOf IPrinter
   */
  name: string;

  /**
   * Eingestellte Papierausrichtung des Aktuell eingestellten Papierfachs ("landscape"/"portrait")
   *
   * @type {string}
   * @memberOf IPrinter
   */
  orientation?: PaperOrientation;

  /**
   * Typ des Druckers "network" oder "local"
   *
   * @type {string}
   * @memberOf IPrinter
   */
  type?: string;

  /**
   * Druckerstatus (z.B. "offline")
   *
   * @type {string}
   * @memberOf IPrinter
   */
  state?: string;

  /**
   * Name des Druckers
   *
   * @type {string}
   * @memberOf IPrinter
   */
  status?: string;

  /**
   * Auflösung des Druckers
   *
   * @type {string}
   * @memberOf IPrinter
   */
  resolution?: string;

  /**
   * Papiergröße des aktuell verwendeten Papierfachs
   *
   * @type {string}
   * @memberOf IPrinter
   */
  papersize?: string;

  /**
   * Breite des Papiers des aktuell verwendeten Papierfachs
   *
   * @type {number}
   * @memberOf IPrinter
   */
  paperwidth?: number;

  /**
   * Höhe des Papiers des aktuell verwendeten Papierfachs
   *
   * @type {number}
   * @memberOf IPrinter
   */
  paperheight?: number;

  /**
   * Bedruckbare Breite des Papiers des aktuell verwendeten Papierfachs
   *
   * @type {number}
   * @memberOf IPrinter
   */
  printablewidth?: number;

  /**
   * Bedruckbare Höhe des Papiers des aktuell verwendeten Papierfachs
   *
   * @type {number}
   * @memberOf IPrinter
   */
  printableheight?: number;

  /**
   * Eingestellte Anzahl Kopien pro Druckjob, Diese Kopien werden durch den Drucker automatisch durchgeführt
   *
   * @type {number}
   * @memberOf IPrinter
   */
  copies?: number;

  /**
   * noch unbekannte Einstellung
   *
   * @type {boolean}
   * @memberOf IPrinter
   */
  canrendercopies?: boolean;

  /**
   * Aktuell verwendetes Papierfach
   *
   * @type {string}
   * @memberOf IPrinter
   */
  currenttray?: string;

  /**
   * Standardpapierfach
   *
   * @type {number}
   * @memberOf IPrinter
   */
  defaulttray?: string;

  /**
   * Verwendbare Papierfächer des Druckers
   *
   * @type {IPrinterTray[]}
   * @memberOf IPrinter
   */
  trays?: IPrinterTray[];
}