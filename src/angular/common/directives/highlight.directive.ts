import { Directive, ElementRef, HostListener, Input, NgModule, Renderer } from '@angular/core';

// fluxgate
import { CommonModule } from '@angular/common';


/**
 * Directive für Tests
 * 
 * @export
 * @class HighlightDirective
 */
@Directive({
  selector: '[flxHighlight]'
})
export class HighlightDirective {
  private _defaultColor = 'red';

  @Input('flxHighlight') public flxHighlight: string;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  @Input() set defaultColor(colorName: string) {
    this._defaultColor = colorName || this._defaultColor;
  }

  // tslint:disable-next-line:no-unused-variable
  @HostListener('mouseenter') private onMouseEnter() {
    this.highlight(this.flxHighlight || this._defaultColor);
  }
  // tslint:disable-next-line:no-unused-variable
  @HostListener('mouseleave') private onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [CommonModule],
  exports: [HighlightDirective],
  declarations: [HighlightDirective]
})
export class HighlightModule { }