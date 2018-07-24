// (() => {
//   require('./src/bootstrap');
// })();

// does not work for barrels with current angular compiler??
export * from './angular';
export * from './testing';

// workaround
export * from './angular/modules/authentication/index';
export * from './angular/modules/autoform/index';
export * from './angular/modules/common/index';
export * from './angular/modules/datatable-selector/index';
export * from './angular/modules/directives/index';
export * from './angular/modules/dropdown-selector/index';
export * from './angular/modules/enum-value/index';
export * from './angular/modules/messages/index';
export * from './angular/modules/month-selector/index';
export * from './angular/modules/role-selector/index';
export * from './angular/modules/selection-list/index';
export * from './angular/modules/sidebar/index';
export * from './angular/modules/tab/index';
export * from './angular/modules/time-selector/index';
export * from './angular/modules/user-selector/index';
export * from './angular/modules/year-selector/index';
export * from './angular/redux/index';
export * from './angular/services/index';
export * from './testing/index';