export type FormAction = 'create' | 'update';

export class FormActions {
  public static CREATE: FormAction = 'create';
  public static UPDATE: FormAction = 'update';
}


export interface IDataFormAction {
  action: FormAction;
  resolverKey: string;
}