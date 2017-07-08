import { Provider } from 'injection-js';

import { Funktion } from '../base/objectType';

export interface IModuleOptions {
  imports?: Funktion[];
  declarations?: Funktion[];
  exports?: Funktion[];
  providers?: Provider[];
}