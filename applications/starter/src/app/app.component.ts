import * as process from 'process';

import { Component, OnInit } from '@angular/core';

import { NotSupportedException } from '@fluxgate/core';
// --------------------------------------logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// --------------------------------------logging --------------------------------------------

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  protected static logger = getLogger(AppComponent);

  public title = 'app';

  public years: number[] = [
  ];

  public selectedYear: number;

  public ngOnInit(): void {
    return using(new XLog(AppComponent.logger, levels.INFO, 'ngOnInit'), (log) => {
      // throw new NotSupportedException('test for module import');
    });
  }

  public onSelectedYearChange(year: number) {
    using(new XLog(AppComponent.logger, levels.DEBUG, 'onSelectedYearChange'), (log) => {
      log.log(`year = ${JSON.stringify(year)}`);
      // this.refreshOvertimes(this.clientuser);
    });
  }
}
