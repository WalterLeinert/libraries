// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { Subscription } from 'rxjs';


// -------------------------- logging -------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------- logging -------------------------------

import { Assert, Core, CustomSubject, ICtor, IToString } from '@fluxgate/core';

import { AppConfig } from '../../src/base/appConfig';
import { IEntity } from '../../src/model';
import { IService } from '../../src/model/service/service.interface';
import { CommonTest } from '../common.spec';

import {
  ICrudServiceRequests, ICrudServiceState, ICurrentItemServiceRequests, ICurrentItemServiceState,
  IServiceRequests, IServiceState, ServiceCommand, ServiceRequests, Store
} from '../../src/redux';
import { EntityVersionCache } from '../../src/redux/cache/entity-version-cache';
import { EntityVersionServiceFake } from '../../src/testing/entity-version-service-fake';
import { ReduxBaseTest } from './redux-base-test';


export abstract class ReduxBaseCacheTest<T extends IEntity<TId>, TId extends IToString, TService
  extends IService<T, TId>> extends ReduxBaseTest<T, TId, TService> {
  protected static readonly logger = getLogger(ReduxBaseCacheTest);

  protected before(done: (err?: any) => void) {
    super.before(() => {
      if (AppConfig.config) {
        AppConfig.config.cacheManagerConfiguration = {
          default: {
            cacheType: 'lru',
          },
          configurations: [
            {
              model: '',
              options: {
                maxItems: 1
              }
            }

          ]
        };

      } else {

        //
        // Konfiguration für Tests registrieren
        // hier nur wichtig: cacheManagerConfiguration
        //
        AppConfig.register({
          url: '',
          mode: 'development',
          proxyMode: 'nop',
          cacheManagerConfiguration: {
            default: {
              cacheType: 'lru'
            },
            configurations: [
              {
                model: '',
                options: {
                  maxItems: 1
                }
              }

            ]
          }
        });
      }
    });

    done();
  }


  protected after(done: (err?: any) => void) {
    super.after(() => {
      AppConfig.unregister();
      done();
    });
  }
}