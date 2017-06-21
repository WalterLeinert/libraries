import { Use } from 'ts-express-decorators';

// Fluxgate
import { ServiceConstants } from '@fluxgate/common';
import { Types } from '@fluxgate/core';


export function UpdateMethod(path?: string | RegExp | any, ...args: any[]) {
  const methodPath = Types.isPresent(path) ? path : `/${ServiceConstants.UPDATE}`;
  return Use(...['put', methodPath].concat(args));
}