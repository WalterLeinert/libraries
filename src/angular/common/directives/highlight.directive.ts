import { NgModule, Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';
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

  @Input('flxHighlight') flxHighlight: string;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  @Input() set defaultColor(colorName: string) {
    this._defaultColor = colorName || this._defaultColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.flxHighlight || this._defaultColor);
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}


@NgModule({
  imports: [CommonModule],
  exports: [HighlightDirective],
  declarations: [HighlightDirective]
})
export class HighlightModule { }