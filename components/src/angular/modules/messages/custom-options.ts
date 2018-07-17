import { IndividualConfig } from 'ngx-toastr';

export class CustomOptions implements Partial<IndividualConfig> {
  public closeButton = true;
}