import { NgModule, Directive, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';


/**
 * Directive zum setzen des Focus auf das Element.
 * 
 * @example
 * <input flxAutofocus type="text" ... name="username" >
 * 
 * Mit Hilfe der Methode @see{focusIf} kann man in einer Komponente manuell den Focus auf ein 
 * Element setzen, welches das Attribute 'flxAutofocus' und den angegebenen Wert für das
 * name-Attribut hat.
 * 
 * Beispiel:
 * 
 * ...
 * import { AutofocusDirective } from '../../common/directives/autofocus.directive';
 * 
 * export class LoginComponent extends BaseComponent<PassportService> {
 *   @ViewChildren(AutofocusDirective) inputs;
 * ...
 *   focusUsername() {
 *     this.inputs.toArray().some(input =>
 *     input.focusIf('username'));
 *   }
 * }
 *
 * 
 * @export
 * @class AutofocusDirective
 */
@Directive({
  selector: '[flxAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private elRef: ElementRef, private renderer: Renderer) {

  }

  ngAfterViewInit() {
    let nameAttribute = this.elRef.nativeElement.getAttribute('name');
    this.focusIf(nameAttribute);
  }

  private setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      // input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      let range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  private setCaretToPos(input, pos) {
    this.setSelectionRange(input, pos, pos);
  }


  /**
   * 
   * 
   * @param {string} nameAttribute
   * @returns
   * 
   * @memberOf AutofocusDirective
   */
  focusIf(nameAttribute: string) {
    // console.log(this.elRef.nativeElement.getAttribute('name'))
    if (this.elRef.nativeElement.getAttribute('name') === nameAttribute) {
      this.renderer.invokeElementMethod(this.elRef.nativeElement, 'focus', []);

      this.setCaretToPos(this.elRef.nativeElement, 0);
      return true;
    }
    return false;
  }
}



@NgModule({
  imports: [CommonModule],
  exports: [AutofocusDirective],
  declarations: [AutofocusDirective]
})
export class AutofocusModule { }