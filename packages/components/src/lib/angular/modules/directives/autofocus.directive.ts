import { CommonModule } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, NgModule, Renderer } from '@angular/core';


// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// fluxgate
// import { Types } from '@fluxgate/common';


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
 */
@Directive({
  selector: '[flxAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  protected static readonly logger = getLogger(AutofocusDirective);


  constructor(private elRef: ElementRef, private renderer: Renderer) {

  }

  public ngAfterViewInit() {
    const nameAttribute = this.elRef.nativeElement.getAttribute('name');
    this.focusIf(nameAttribute);
  }

  private setSelectionRange(input: any, selectionStart: number, selectionEnd: number) {
    if (input.setSelectionRange) {
      // input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      const range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  private setCaretToPos(input: any, pos: number) {
    this.setSelectionRange(input, pos, pos);
  }


  /**
   *
   *
   * @param nameAttribute
   * @returns
   *
   * @memberOf AutofocusDirective
   */
  private focusIf(nameAttribute: string): boolean {
    return using(new XLog(AutofocusDirective.logger, levels.DEBUG, 'focusIf', `nameAttribute = ${nameAttribute}`),
      (log) => {
        if (log.isDebugEnabled()) {
          log.log(`attribue[name] = ${this.elRef.nativeElement.getAttribute('name')}`);
        }

        if (this.elRef.nativeElement.getAttribute('name') === nameAttribute) {
          this.renderer.invokeElementMethod(this.elRef.nativeElement, 'focus', []);

          // setzt die Caret Position hinter das letzte Zeichen
          // if (this.elRef.nativeElement.value) {
          //   if (Types.isString(this.elRef.nativeElement.value)) {
          //     const length = (this.elRef.nativeElement.value as string).length;
          //     this.setCaretToPos(this.elRef.nativeElement, length);
          //   }
          // }

          this.setCaretToPos(this.elRef.nativeElement, 0);

          return true;
        }
        return false;
      });
  }
}



// tslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [CommonModule],
  exports: [AutofocusDirective],
  declarations: [AutofocusDirective]
})
export class AutofocusModule { }