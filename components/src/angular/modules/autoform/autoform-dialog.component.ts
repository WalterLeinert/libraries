// tslint:disable:max-line-length

import { Component, Injector, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import {
  FormAction, FormActions, IAutoformConfig,
  IDataFormAction, MessageService, MetadataService, ServiceRequestsComponent
} from '@fluxgate/client';
import { ICrudServiceRequests } from '@fluxgate/common';
import { Assert, Core, NotSupportedException, Utility } from '@fluxgate/core';


@Component({
  selector: 'flx-autoform-dialog',
  template: `
<p-dialog [(visible)]="value" [header]="pageTitle" (onHide)="onBeforeDialogHide($event)" [responsive]="true" showEffect="fade"
  [modal]="true" width="600">

  <div>
    <flx-autoform [value]="value" [config]="config" [action]="action" [showButtons]="'true'" [skipNgOnInit]="'true'"
    (close)="onClose($event)" (cancel)="onCancel()">
    </flx-autoform>
 </div>

  <flx-confirmation-dialog></flx-confirmation-dialog>
</p-dialog>
`,
  styles: [`
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* green */
}

.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* red */
}
`]
})
export class AutoformDialogComponent extends ServiceRequestsComponent<any, ICrudServiceRequests<any, any>> {
  protected static readonly logger = getLogger(AutoformDialogComponent);

  public static DETAILS = 'Details';

  public pageTitle: string = AutoformDialogComponent.DETAILS;


  // >> Value Property
  /**
   * (von aussen) angebundenes Objekt.
   *
   * @type {*}
   */
  @Input() public value: any;
  // << Value Property


  /**
   * Die durchzuführende Aktion (creae, edit, etc.)
   *
   * @private
   * @type {FormAction}
   * @memberOf AutoformComponent
   */
  @Input() public action: FormAction;


  // >> Konfiguration

  /**
   *
   *
   * @private
   * @type {IAutoformConfig}
   * @memberOf AutoformDialogComponent
   */
  @Input() public config: IAutoformConfig;

  public configInternal: IAutoformConfig;
  // << Konfiguration


  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService, private injector: Injector,
    private metadataService: MetadataService) {
    super(router, route, messageService, null);

    using(new XLog(AutoformDialogComponent.logger, levels.INFO, 'ctor'), (log) => {
      this.route.params.subscribe((p) => {
        log.log(`params = ${Core.stringify(p)}`);
      });
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    using(new XLog(AutoformDialogComponent.logger, levels.INFO, 'ctor'), (log) => {
      super.ngOnInit();

      this.route.data.subscribe((data: IDataFormAction) => {
        log.log(`data = ${Core.stringify(data)}`);

        Assert.notNull(data);

        if (Utility.isNullOrEmpty(data.action) || Utility.isNullOrEmpty(data.resolverKey)) {
          if (Utility.isNullOrEmpty(data.action)) {
            log.warn(`data.action is empty`);
          }
          if (Utility.isNullOrEmpty(data.resolverKey)) {
            log.warn(`data.resolverKey is empty`);
          }

        } else {
          Assert.notNullOrEmpty(data.action);
          Assert.notNullOrEmpty(data.resolverKey);

          this.action = data.action;

          const value = data[data.resolverKey];
          Assert.notNull(value);

          this.value = value;
        }
      });
    });
  }


  /**
   * Handler für das Schliessen über ESC oder close-icon
   */
  public onBeforeDialogHide() {
    this.closePopup();
  }

  public onCancel() {
    this.closePopup();
  }

  public onClose(formResetRequired: boolean) {
    this.doClose(formResetRequired);
  }


  /**
   * Schliesst Autoform, falls keine ungespeicherten Änderungen vorliegen bzw. das Schliessen bestätigt wurde.
   *
   * @private
   *
   * @memberof AutoformDialogComponent
   */
  private closePopup() {
    if (this.hasChanges()) {

      if (confirm('You have unsaved changes: OK to discard?')) {
        this.doClose(true);
      }

      // this.confirmAction({
      //   header: 'Unsaved Changes',
      //   message: 'You have unsaved changes: OK to discard?'
      // }, () =>
      //     this.doClose(true)
      // );
    } else {
      this.doClose(false);
    }
  }


  /**
   * Schliesst Autoform, indem auf die vorherige Seite navigiert wird.
   *
   * @private
   * @param {boolean} formResetRequired - falls true, wird ein resetFormGroup durchgeführt,
   * damit nicht ein GuardService die Navigation verhindert.
   *
   * @memberof AutoformDialogComponent
   */
  private doClose(formResetRequired: boolean) {
    using(new XLog(AutoformDialogComponent.logger, levels.INFO, 'doClose', `formResetRequired = ${formResetRequired}, action = ${this.action}`), (log) => {
      let navigationPath: string;

      if (formResetRequired) {
        // weitere Abfragen unterdrücken
        this.resetFormGroup(this.value);
      }

      switch (this.action) {
        // die Navigation für create hat keine Id im Pfad (.../create)
        case FormActions.CREATE:
          navigationPath = '..';
          break;

        case FormActions.UPDATE:
          // die Navigation für update hat eine Id im Pfad (.../update/:id)
          navigationPath = '../..';
          break;

        default:
          throw new NotSupportedException(`unsupported action ${this.action}`);
      }

      this.navigate([navigationPath, { refresh: !formResetRequired }], { relativeTo: this.route });
    });
  }

}