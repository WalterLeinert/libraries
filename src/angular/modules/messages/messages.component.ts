import { Component, OnInit, ViewContainerRef } from '@angular/core';

// import 'ng2-toastr/bundles/ng2-toastr.min.css';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { MessageSeverity, NotSupportedException } from '@fluxgate/common';

import { MessageService } from '../../services/message.service';


@Component({
  selector: 'flx-messages',
  template: `
<div></div>
`
})
export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService, private toastr: ToastsManager, vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);

    this.messageService.getMessage().subscribe((message) => {
      switch (message.severity) {

        case MessageSeverity.Success:
          this.toastr.success(message.detail, message.summary);
          break;

        case MessageSeverity.Info:
          this.toastr.info(message.detail, message.summary);
          break;

        case MessageSeverity.Warn:
          this.toastr.warning(message.detail, message.summary, {
            closeButton: true,
            dismiss: 'click'
          });
          break;

        case MessageSeverity.Error:
          this.toastr.error(message.detail, message.summary, {
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

}
