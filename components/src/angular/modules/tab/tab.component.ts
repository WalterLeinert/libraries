import { Component, Input, OnInit } from '@angular/core';

import { Tab } from './tab';

@Component({
  selector: 'flx-tab',
  template: `
<div style="margin: 0 0 0 20px">
  <ul class="nav nav-tabs" role="tablist">
    <li *ngFor="let tab of tabs" data-toggle="tab" role="tab" class="nav-panel {{tab.status}}">
      <a class="nav-link" (click)="GoTo(tab.route)">{{ tab.header }}</a>
    </li>
  </ul>
</div>
  `,
  styles: [`
.nav-tabs {
  border-bottom: 1px solid transparent;
  cursor: default;
}
.nav-tabs > li {
  float: left;
  margin-bottom: -1px;
  cursor: default;
  color: #555555;
}
.nav-tabs > li > a {
  cursor: default;
  color: #555555;
  line-height: 0.9;
  background-color: #fafafa;
  border: 0px solid transparent;
}
.nav-tabs > li > a:hover {
  cursor: default;
  background-color: #cacaca;
}
.nav-tabs > li.active > a,
.nav-tabs > li.active > a:hover,
.nav-tabs > li.active > a:focus {
  color: #555;
  cursor: default;
  background-color: #eee;
  border-bottom-color: transparent;
}
.nav-tabs.nav-justified {
  width: 100%;
  border-bottom: 0;
}
.nav-tabs.nav-justified > li {
  float: none;
}
.nav-tabs.nav-justified > li > a {
  margin-bottom: 5px;
  text-align: center;
}
.nav-tabs.nav-justified > .dropdown .dropdown-menu {
  top: auto;
  left: auto;
}
@media (min-width: 768px) {
  .nav-tabs.nav-justified > li {
    display: table-cell;
    width: 1%;
  }
  .nav-tabs.nav-justified > li > a {
    margin-bottom: 0;
  }
}
.nav-tabs.nav-justified > li > a {
  margin-right: 0;
  border-radius: 2px;
}
.nav-tabs.nav-justified > .active > a,
.nav-tabs.nav-justified > .active > a:hover,
.nav-tabs.nav-justified > .active > a:focus {
  border: 1px solid #eee;
}
@media (min-width: 768px) {
  .nav-tabs.nav-justified > li > a {
    border-bottom: 1px solid #eee;
    border-radius: 2px 2px 0 0;
  }
  .nav-tabs.nav-justified > .active > a,
  .nav-tabs.nav-justified > .active > a:hover,
  .nav-tabs.nav-justified > .active > a:focus {
    border-bottom-color: #fff;
  }
}
`]

})
export class TabComponent implements OnInit {
  @Input() public tabs: Tab[];

  public ngOnInit() {
    // ok
  }

}
