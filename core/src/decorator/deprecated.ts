import { StringBuilder } from '../base/stringBuilder';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../diagnostics/logger.interface';
import { getLogger } from '../diagnostics/logging-core';
import { Types } from '../types/types';
import { Utility } from '../util/utility';

const logger = getLogger('Deprecated');

const MAX_STACK_DEPTH = 30;
const FRAMES_TO_SKIP = 2;

/**
 * Decorator: markiert Klasse, Funktion, Property als deprecated und gibt eine Warnung aus.
 *
 * @export
 * @param {string} [message] - deprecation Message
 * @param {string} [printStack] - falls true, wird der Stack um die Verwendungsstelle ausgegeben
 * @returns
 */
export function Deprecated(message?: string, printStack: boolean = true) {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
        const err = new Error('deprecated');
        const sb = new StringBuilder('*** ');

        let func;
        if (Types.isFunction(target)) {
            // Klassendecorator
            func = target as Function;
        } else if (Types.isObject(target)) {
            // Memberdecorator
            func = target.constructor as Function;
        }
        if (Types.isPresent(func)) {
            sb.append(func.name);
        }

        if (!Utility.isNullOrEmpty(propertyKey)) {
            if (!sb.isEmpty) {
                sb.append('.');
            }
            sb.append(propertyKey);
        }
        if (!Utility.isNullOrEmpty(message)) {
            if (!sb.isEmpty) {
                sb.append(': ');
            }
            sb.append(message);
        }

        if (printStack) {
            sb.appendLine();

            // "Error: deprecated" entfernen
            const stackArray = err.stack.split('\n').slice(1);
            const length = Math.min(stackArray.length, MAX_STACK_DEPTH);
            const stackReduced = stackArray.slice(FRAMES_TO_SKIP, length);

            sb.appendLine(stackReduced.join('\n'));
            if (length < stackArray.length) {
                sb.appendLine(`    ... (skipping ${stackArray.length - length} frames)`);
            }
        }

        logger.warn(sb.toString());
    };
}