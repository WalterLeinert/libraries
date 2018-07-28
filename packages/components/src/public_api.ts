// (() => {
//   require('./src/bootstrap');
// })();

// does not work for barrels with current angular compiler??
// export * from './angular';
// export * from './testing';

// workaround
export * from './lib/angular/modules/authentication/index';
export * from './lib/angular/modules/autoform/index';
export * from './lib/angular/modules/autoform/autoform-controls/autoform-controls.component';
export * from './lib/angular/modules/autoform/autoform-controls/autoform-controls.module';
export * from './lib/angular/modules/client-services.module';
export * from './lib/angular/modules/common/index';
export * from './lib/angular/modules/common/confirmation-dialog/confirmation-dialog.component';
export * from './lib/angular/modules/common/popup/popup.component';
export * from './lib/angular/modules/datatable-selector/index';
export * from './lib/angular/modules/directives/index';
export * from './lib/angular/modules/dropdown-selector/index';
export * from './lib/angular/modules/enum-value/index';
export * from './lib/angular/modules/messages/index';
export * from './lib/angular/modules/month-selector/index';
export * from './lib/angular/modules/role-selector/index';
export * from './lib/angular/modules/selection-list/index';
export * from './lib/angular/modules/sidebar/index';
export * from './lib/angular/modules/tab/index';
export * from './lib/angular/modules/time-selector/index';
export * from './lib/angular/modules/user-selector/index';
export * from './lib/angular/modules/year-selector/index';
export * from './lib/angular/redux/index';
export * from './lib/angular/services/index';
export * from './lib/testing/index';