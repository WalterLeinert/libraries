import { ToastOptions } from 'ng2-toastr';

export class CustomOptions extends ToastOptions {
  public animate = 'flyRight'; // you can pass any options to override defaults
  public newestOnTop = false;
  public showCloseButton = true;
  public dismiss = 'auto';
}