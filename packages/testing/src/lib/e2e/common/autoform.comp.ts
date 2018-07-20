import { browser, by, element, ElementFinder, promise } from 'protractor';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { ColumnMetadata, MetadataStorage, TableMetadata } from '@fluxgate/common';
import { Assert, Funktion, Types } from '@fluxgate/core';

import { ButtonComponent } from './button.comp';
import { IControlInfo } from './control-info.interface';
import { E2eComponent, IE2eComponent } from './e2e-component';
import { InputComponent } from './input.comp';
import { LabelComponent } from './label.comp';


/**
 * helper class for e2e tests of flx-autoform
 */
export class AutoformComponent extends E2eComponent {
  protected static readonly logger = getLogger(AutoformComponent);

  protected static LOCATOR = 'flx-autoform';

  private nameSet: Set<string> = new Set<string>();
  private metadataMap: Map<string, ColumnMetadata> = new Map<string, ColumnMetadata>();
  private componentMap: Map<string, E2eComponent> = new Map<string, E2eComponent>();
  private tableMetadata: TableMetadata;
  private infoMap: Map<string, IControlInfo> = new Map<string, IControlInfo>();

  private _newButton: ButtonComponent;
  private _deleteButton: ButtonComponent;
  private _saveButton: ButtonComponent;
  private _cancelButton: ButtonComponent;

  constructor(parent: IE2eComponent,
    public names: string[] | IControlInfo[], private _model?: Funktion | string) {
    super(parent, AutoformComponent.LOCATOR);

    using(new XLog(AutoformComponent.logger, levels.INFO, 'ctor'), (log) => {

      if (names.length > 0) {
        if (typeof names[0] === 'string') {
          this.tableMetadata = MetadataStorage.instance.findTableMetadata(this._model);
          Assert.notNull(this.tableMetadata);

          (names as string[]).forEach((name) => {
            const colMetadata = this.tableMetadata.getColumnMetadataByProperty(name);
            Assert.notNull(colMetadata, `${this.tableMetadata.className} has no property ${name}`);
            this.metadataMap.set(name, colMetadata);
            this.nameSet.add(name);
          });
        } else {
          (names as IControlInfo[]).forEach((info) => {
            this.infoMap.set(info.name, info);
            this.nameSet.add(info.name);
          });
        }
      }


      log.warn('TODO: in Zukunft müssen die Components in Abhängigkeit vom Typ erzeugt werden!');

      this.nameSet.forEach((n) => {
        this.componentMap.set(n, new InputComponent(this, `#${n}`));
      });

      this._newButton = new ButtonComponent(this, '#new');
      this._deleteButton = new ButtonComponent(this, '#delete');
      this._saveButton = new ButtonComponent(this, '#save');
      this._cancelButton = new ButtonComponent(this, '#cancel');
    });
  }


  public async expectElements() {
    Array.from(this.componentMap.values()).forEach(async (c) => {
      expect(await c.getElement()).not.toBeNull();
    });

    expect(await this.newButton.getElement()).not.toBeNull();
    expect(await this.deleteButton.getElement()).not.toBeNull();
    expect(await this.saveButton.getElement()).not.toBeNull();
    expect(await this.cancelButton.getElement()).not.toBeNull();
  }


  /**
   * Liefert den Labeltext für das Modelattribut mit Namen @param{name}.
   *
   * @param {string} name
   * @returns {promise.Promise<string>}
   * @memberof AutoformComponent
   */
  public getLabelText(name: string): promise.Promise<string> {
    if (!this.nameSet.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.getElement().element(this.byCss(
      `flx-autoform-controls label.control-label[for="${name}"]`)).getText();
  }


  public getDisplayName(name: string): string {
    if (!this.nameSet.has(name)) {
      throw new Error(`unkown model attribute: ${name}`);
    }
    return this.metadataMap.get(name).options.displayName;
  }


  public get infos(): IControlInfo[] {
    return Array.from(this.infoMap.values());
  }

  public getComponent<T extends E2eComponent>(name: string): T {
    return this.componentMap.get(name) as T;
  }

  public getComponentValue<T extends E2eComponent>(name: string): promise.Promise<string> {
    return this.getComponent(name).getElement().getAttribute('ng-reflect-model');
  }

  public get newButton(): ButtonComponent {
    return this._newButton;
  }

  public get deleteButton(): ButtonComponent {
    return this._deleteButton;
  }

  public get saveButton(): ButtonComponent {
    return this._saveButton;
  }

  public get cancelButton(): ButtonComponent {
    return this._cancelButton;
  }
}