import { Component, Input, OnInit } from '@angular/core';

import { Tab } from './tab';

@Component({
  selector: 'flx-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() public tabs: Tab[];

  public ngOnInit() {
    // ok
  }

}
