import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


// PrimeNG
import { ConfirmDialogModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/common';


@Component({
  template: `
<p-confirmDialog icon="fa fa-question-circle-o fa5x" width="450" #cd>
  <footer>
    <button type="button" pButton label="Cancel" (click)="cd.reject()"></button>
    <button type="button" pButton icon="fa-trash-o" label="OK" (click)="cd.accept()"></button>
  </footer>
</p-confirmDialog>
`
})
export class ConfirmationDialogComponent {
  protected static readonly logger = getLogger(ConfirmationDialogComponent);

  public header: string;
  public message: string;

  constructor(private confirmationService: ConfirmationService) {
  }

  public isConfirmed(header: string, message: string): Observable<boolean> {
    return using(new XLog(ConfirmationDialogComponent.logger, levels.INFO, 'isConfirmed'), (log) => {

      const subject = new BehaviorSubject<boolean>(undefined);

      this.confirmationService.confirm({
        header: header,
        message: message,
        accept: () => {
          log.log('accept');
          subject.next(true);
        },
        reject: () => {
          log.log('reject');
          subject.next(false);
        }
      });
      return subject;
    });
  }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  declarations: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationService
  ]
})
export class ConfirmationDialogModule { }