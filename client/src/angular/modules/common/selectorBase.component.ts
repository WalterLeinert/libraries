// tslint:disable:member-ordering

import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';

import { ControlBaseComponent } from '../../common/base/control-base.component';
import { MessageService } from '../../services/message.service';
import { MetadataService } from '../../services/metadata.service';

/**
 * Basisklasse für alle Selector-Komponenten
 */
export abstract class SelectorBaseComponent<T> extends ControlBaseComponent<T> {
  protected static logger = getLogger(SelectorBaseComponent);


  /**
   * falls true, wird Debug-Info beim Control angezeigt
   *
   * @type {boolean}
   */
  @Input() public debug: boolean = false;


  /**
   * falls true, ist die Komponente editierbar
   *
   * @type {boolean}
   */
  private _editable: boolean = false;

  private _style: any;


  /**
   * locale-Property
   *
   * @type {string}
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
      'onEditableChange', `value = ${JSON.stringify(value)}`), (log) => {
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