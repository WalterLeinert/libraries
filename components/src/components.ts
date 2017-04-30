export { ClientServicesModule } from './angular/modules';

export {
  AuthenticationModule, AuthenticationNavigation, AuthenticationNavigationToken, ChangePasswordComponent,
  LoginComponent, LogoffComponent, PassportService, RegisterComponent, RegisterGuardService,
  RoleService, UserService
} from './angular/modules/authentication';

export { AutoformComponent, AutoformModule } from './angular/modules/autoform';

export {
  ApplicationErrorHandler, ConfirmationDialogComponent, ILoggingErrorHandlerOptions,
  ApplicationErrorHandlerModule, ConfirmationDialogModule, LOGGING_ERROR_HANDLER_OPTIONS,
  ListSelectorComponent, PopupComponent, PopupModule, SelectorBaseComponent
} from './angular/modules/common';

export {
  DataTableSelectorComponent, DataTableSelectorModule, IDataTableSelectorConfig, selectionMode, sortMode
} from './angular/modules/datatable-selector';

export {
  AutofocusDirective, AutofocusModule, FocusDirective, FocusModule, HighlightDirective, HighlightModule
} from './angular/modules/directives';

export {
  DropdownSelectorComponent, DropdownSelectorModule, IDropdownSelectorConfig
} from './angular/modules/dropdown-selector';

export { EnumValueComponent } from './angular/modules/enum-value';
export { MessagesComponent, MessagesModule } from './angular/modules/messages';
export { MonthSelectorComponent, IMonth, MonthSelectorModule } from './angular/modules/month-selector';
export { RoleSelectorComponent, RoleSelectorModule } from './angular/modules/role-selector';
export { TimeSelectorComponent, TimeSelectorModule } from './angular/modules/time-selector';
export { UserSelectorComponent, UserSelectorModule } from './angular/modules/user-selector';
export { YearSelectorComponent, YearSelectorModule } from './angular/modules/year-selector';


export {
  CurrentUserServiceRequests, CurrentUserServiceRequestsModule, EnhancedServiceRequests,
  RoleSelectorServiceRequests, RoleSelectorServiceRequestsModule, RoleSelectorStore,
  RoleServiceRequests, RoleServiceRequestsModule, UserSelectorServiceRequests,
  UserSelectorServiceRequestsModule, UserSelectorStore, UserServiceRequests, UserServiceRequestsModule
} from './angular/redux';

export {
  ComponentGuardModule, ComponentGuardService,
  ComponentServices, ComponentServicesModule,
  MessageServiceModule
} from './angular/services';

export { RoleServiceFake, UserServiceFake } from './testing';