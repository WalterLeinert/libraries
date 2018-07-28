import { Component } from '@angular/core';

import { ConfirmationService } from 'primeng/components/common/api';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ConfirmationService]
})
export class HomeComponent {
  protected static readonly logger = getLogger(HomeComponent);

  public pageTitle: string = 'Welcome';

  constructor(private confirmationService: ConfirmationService) { }

  public confirm() {
    using(new XLog(HomeComponent.logger, levels.INFO, 'confirm'), (log) => {
      this.confirmationService.confirm({
        header: 'Preisfrage',
        message: 'wird es bald schneien?',
        accept: () => {
          log.log('das glaub ich auch!');
          this.cancel();
        },
        reject: () => {
          log.log('da bin ich mir nicht so sicher!');
        }
      });
    });
  }


  public cancel() {
    using(new XLog(HomeComponent.logger, levels.INFO, 'cancel'), (log) => {
      log.log('funktionssprung');
    });
  }
}
