import { Component, OnInit } from '@angular/core';

// Resizing
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'flx-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public static readonly MIN_MENU_WIDTH = 250;
  public static readonly DEFAULT_DOCKED_SIZE = '35px';
  public static readonly PINNED_ICON = 'fa fa fa-thumb-tack fa-lg';
  public static readonly UNPINNED_ICON = SidebarComponent.PINNED_ICON + 'fa-rotate-90';

  // sidebar
  public opened: boolean = false;
  public pinbutton: string = SidebarComponent.UNPINNED_ICON;
  public mode: string = 'over';
  public closeOnClickOutside: boolean = true;
  public menueSize: number = 300;
  public dockedSize: string = SidebarComponent.DEFAULT_DOCKED_SIZE;
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
    if (this.menueSize < SidebarComponent.MIN_MENU_WIDTH) { this.menueSize = SidebarComponent.MIN_MENU_WIDTH; }

    if (this._pinned) {
      this.dockedSize = this.menueSize + 'px';
      this.toggleSidebar();
    }
  }


  public togglePinned() {
    this._pinned = !this._pinned;

    if (this._pinned) {
      this.dockedSize = this.menueSize + 'px';
      this.pinbutton = SidebarComponent.PINNED_ICON;
      this.opened = false;
    } else {
      this.dockedSize = SidebarComponent.DEFAULT_DOCKED_SIZE;
      this.pinbutton = SidebarComponent.UNPINNED_ICON;
      this.opened = true;
    }
  }

}
