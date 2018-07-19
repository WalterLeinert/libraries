(() => {
  require('./bootstrap');
})();

// re-export symbols
export { Injectable, InjectionToken, Inject, Optional, Injector, ReflectiveInjector } from 'injection-js';

export * from './adapter';
export * from './bootstrap';
export * from './base';
export * from './cache';
export * from './collection';
export * from './converter';
export * from './decorator';
export * from './di';
export * from './diagnostics';
export * from './exceptions';
export * from './expression';
export * from './metadata';
export * from './pattern';
export * from './reflection';
export * from './serialization';
export * from './suspendable';
export * from './types';
export * from './util';