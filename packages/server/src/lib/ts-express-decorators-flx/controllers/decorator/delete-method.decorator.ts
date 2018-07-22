import { Use } from 'ts-express-decorators';

// Fluxgate
import { ServiceConstants } from '@fluxgate/common';
import { Types } from '@fluxgate/core';


export function DeleteMethod(path?: string | RegExp | any, ...args: any[]) {
  const methodPath = Types.isPresent(path) ? path : `/${ServiceConstants.DELETE}`;
  return Use(...['delete', methodPath].concat(args));
}