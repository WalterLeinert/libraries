import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';

// import 'ng2-toastr/bundles/ng2-toastr.min.css';
import { ToastrService } from 'ngx-toastr';

import { MessageService } from '@fluxgate/client';
import { MessageSeverity, NotSupportedException } from '@fluxgate/core';


@Component({
  selector: 'flx-messages',
  template: `
<div></div>
`
})
export class MessagesComponent implements OnInit {

  private static readonly TOASTR_OPTIONS = { timeOut: 3000 };   // 3 sec

  constructor(private messageService: MessageService, private toastsManager: ToastrService, vRef: ViewContainerRef) {

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
            tapToDismiss: false
          });
          break;

        case MessageSeverity.Error:
          this.toastsManager.error(message.detail, message.summary, {
            closeButton: true,
            tapToDismiss: true
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
}
