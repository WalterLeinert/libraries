// tslint:disable:member-ordering

import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { ControlBaseComponent, MessageService, MetadataService } from '@fluxgate/client';
import { Core } from '@fluxgate/core';


/**
 * Basisklasse für alle Selector-Komponenten
 */
export abstract class SelectorBaseComponent<T> extends ControlBaseComponent<T> {
  protected static logger = getLogger(SelectorBaseComponent);


  /**
   * falls true, wird Debug-Info beim Control angezeigt
   */
  @Input() public debug: boolean = false;


  /**
   * falls true, ist die Komponente editierbar
   */
  private _editable: boolean = false;

  private _style: any;


  /**
   * locale-Property
   */
  private _locale: string = 'en';

  protected constructor(router: Router, private _metadataService: MetadataService, messageService: MessageService,
    private _changeDetectorRef: ChangeDetectorRef) {
    super(messageService);
  }


  protected get metadataService(): MetadataService {
    return this._metadataService;
  }

  protected get changeDetectorRef(): ChangeDetectorRef {
    return this._changeDetectorRef;
  }


  // -------------------------------------------------------------------------------------
  // Property locale
  // -------------------------------------------------------------------------------------
  protected onLocaleChange(value: string) {
    // ok
  }

  public get locale(): string {
    return this._locale;
  }

  @Input() public set locale(value: string) {
    if (this._locale !== value) {
      this._locale = value;
      this.onLocaleChange(value);
    }
  }


  /**
   * Property editable
   */
  protected onEditableChange(value: boolean) {
    using(new XLog(SelectorBaseComponent.logger, levels.INFO,
      'onEditableChange', `value = ${Core.stringify(value)}`), (log) => {
        // ok
      });
  }

  public get editable(): boolean {
    return this._editable;
  }

  @Input() public set editable(value: boolean) {
    if (this._editable !== value) {
      this._editable = value;
      this.onEditableChange(value);
    }
  }


  /**
   * Property editable
   */
  public get style(): any {
    return this._style;
  }

  @Input() public set style(value: any) {
    this._style = value;
  }
}