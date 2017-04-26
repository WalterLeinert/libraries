import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';

// import 'ng2-toastr/bundles/ng2-toastr.min.css';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { MessageSeverity, NotSupportedException } from '@fluxgate/core';

import { MessageService } from '../../services/message.service';


@Component({
  selector: 'flx-messages',
  template: `
<div></div>
`
})
export class MessagesComponent implements OnInit, OnDestroy {

  private static readonly TOASTR_OPTIONS = { toastLife: 3000 };   // 3 sec

  constructor(private messageService: MessageService, private toastsManager: ToastsManager, vRef: ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(vRef);

    this.messageService.getMessage().subscribe((message) => {
      switch (message.severity) {

        case MessageSeverity.Success:
          this.toastsManager.success(message.detail, message.summary, MessagesComponent.TOASTR_OPTIONS);
          break;

        case MessageSeverity.Info:
          this.toastsManager.info(message.detail, message.summary, MessagesComponent.TOASTR_OPTIONS);
          break;

        case MessageSeverity.Warn:
          this.toastsManager.warning(message.detail, message.summary, {
            closeButton: true,
            dismiss: 'click'
          });
          break;

        case MessageSeverity.Error:
          this.toastsManager.error(message.detail, message.summary, {
            closeButton: true,
            dismiss: 'controlled'
          });
          break;

        default:
          throw new NotSupportedException();
      }
    });
  }

  public ngOnInit() {
    // ok
  }

  public ngOnDestroy() {
    this.toastsManager.dispose();
  }
}
