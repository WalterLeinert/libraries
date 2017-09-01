import { Component, OnInit } from '@angular/core';

// Resizing
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'flx-sidebar',
  template: `
<ng-sidebar-container class="noscroll" >
  <ng-sidebar class="ng-sidebar noscroll" [(opened)] = "opened" style="height:100%;" [mode]="mode"
    [closeOnClickOutside] = "closeOnClickOutside"
    [closeOnClickBackdrop] = "false" dock=true
    [dockedSize] = "dockedSize"
    [sidebarClass] = "demo-sidebar" >
      <div mwlResizable class="noscroll borderright"
      [ngStyle] = "{'width': menueSize + 'px', 'height':'100%', 'background-color': '#eeeeee'}"
      [resizeEdges] = "{right: true}"
      [resizeCursorPrecision] = "10"
      [enableGhostResize] = "true"(resizeStart) = "onResizeStart($event)" (resizeEnd)="onResizeEnd($event)">
      <div style="width:100%; height:35px; padding:0">
        <a class="btn btn-sm pull-right" (click) = "toggleSidebar()" data-toggle="tooltip"
          data-placement="right" title="toggle sidebar">
          <i class="fa fa-bars fa-lg">
          </i>
        </a>
        <a class="btn btn-sm pull-right" (click) = "togglePinned()" data-toggle="tooltip"
          data-placement="right" title="toggle sidebar pin" >
          <i [ngClass]="pinbutton">
          </i>
        </a>
      </div>

    <div id=Containerfixed>
      <ng-content select="[flx-sidebar-icons]"> </ng-content>
    </div>

    <div id=Containerauto >
      <ng-content select="[flx-sidebar-main]"> </ng-content>
    </div>

    </div>
  </ng-sidebar>

  <div ng-sidebar-content >
      <ng-content select="[flx-sidebar-detail]"> </ng-content>
  </div>
</ng-sidebar-container>`,
  styles: [`
#Containerfixed {
  width: 40px;
  float: right;
}

#Containerauto {
  overflow-y:scroll;
  overflow-x:hidden;
  height:95%;
  height:calc(100%-50px);
  height: -moz-calc(100%-50px);
  height: -webkit-calc(100%-50px);
}

.noscroll {
  overflow:hidden;
}

.borderright {
  border: 0px solid #cccccc;
  border-right-width: 1px;
}

.shadow {
  box-shadow: 0 0 1.5em rgba(85,85,85,.5);
}

.ng-sidebar--docked {
  box-shadow: 0 0 1.5em rgba(85,85,85,.5);
}
`]
})
export class FlxSidebarComponent implements OnInit {
  public static readonly MIN_MENU_WIDTH = 250;
  public static readonly DEFAULT_DOCKED_SIZE = '35px';
  public static readonly PINNED_ICON = 'fa fa fa-thumb-tack fa-lg';
  public static readonly UNPINNED_ICON = FlxSidebarComponent.PINNED_ICON + ' fa-rotate-90';

  // sidebar
  public opened: boolean = false;
  public pinbutton: string = FlxSidebarComponent.UNPINNED_ICON;
  public mode: string = 'over';
  public closeOnClickOutside: boolean = true;
  public menueSize: number = 300;
  public dockedSize: string = FlxSidebarComponent.DEFAULT_DOCKED_SIZE;
  private _pinned: boolean = false;


  public ngOnInit() {
    // ok
  }

  public toggleSidebar() {
    this.opened = !this.opened;
  }


  public onResizeStart(event: ResizeEvent): void {
    if (this._pinned) {
      this.toggleSidebar();
    }
  }


  public onResizeEnd(event: ResizeEvent): void {
    this.menueSize = event.rectangle.width;
    if (this.menueSize < FlxSidebarComponent.MIN_MENU_WIDTH) { this.menueSize = FlxSidebarComponent.MIN_MENU_WIDTH; }

    if (this._pinned) {
      this.dockedSize = this.menueSize + 'px';
      this.toggleSidebar();
    }
  }


  public togglePinned() {
    this._pinned = !this._pinned;

    if (this._pinned) {
      this.dockedSize = this.menueSize + 'px';
      this.pinbutton = FlxSidebarComponent.PINNED_ICON;
      this.opened = false;
    } else {
      this.dockedSize = FlxSidebarComponent.DEFAULT_DOCKED_SIZE;
      this.pinbutton = FlxSidebarComponent.UNPINNED_ICON;
      this.opened = true;
    }
  }

}
