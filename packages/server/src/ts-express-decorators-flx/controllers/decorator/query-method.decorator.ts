import { Use } from 'ts-express-decorators';

// Fluxgate
import { ServiceConstants } from '@fluxgate/common';
import { Types } from '@fluxgate/core';


export function QueryMethod(path?: string | RegExp | any, ...args: any[]) {
  const methodPath = Types.isPresent(path) ? path : `/${ServiceConstants.QUERY}`;
  return Use(...['post', methodPath].concat(args));
}