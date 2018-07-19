import { Use } from 'ts-express-decorators';

// Fluxgate
import { ServiceConstants } from '@fluxgate/common';
import { Types } from '@fluxgate/core';


export function FindByIdMethod(path?: string | RegExp | any, ...args: any[]) {
  const methodPath = Types.isPresent(path) ? path : `/${ServiceConstants.FIND_BY_ID}`;
  return Use(...['get', methodPath].concat(args));
}