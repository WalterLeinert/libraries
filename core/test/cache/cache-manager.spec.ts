// tslint:disable:member-access
// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IConfig } from '../../src/diagnostics/config.interface';
import { configure } from '../../src/diagnostics/logging-core';

import { CoreUnitTest } from '../../src/testing/unit-test';

import { CacheManager } from '../../src/cache/cache-manager';
import { CacheTypes } from '../../src/cache/cache-type';
import { LruCache } from '../../src/cache/lru-cache';


class CacheItem {
  public constructor(public id: string, public name: string) { }
}


@suite('core.cache.CacheManager')
class ConverterTest extends CoreUnitTest {
  private cacheManager: CacheManager;

  @test 'should create cacheManager'() {
    expect(this.cacheManager).to.be.not.null;
    expect(this.cacheManager.count).to.equal(1);
  }

  @test 'should contain cache'() {
    expect(this.cacheManager.containsCache(CacheItem)).to.be.true;
  }

  @test 'should exist cacheManager'() {
    this.cacheManager.addCache(CacheItem, new LruCache<CacheItem, string>());
    expect(this.cacheManager.count).to.equal(1);
  }

  @test 'should set cacheItem'() {
    const item = new CacheItem('hugo', 'hirsch');
    expect(() => this.cacheManager.setItem(CacheItem, item.id, item)).not.to.Throw();
  }

  @test 'should get cacheItem'() {
    const item = new CacheItem('hugo', 'hirsch');
    this.cacheManager.setItem(CacheItem, item.id, item);
    expect(this.cacheManager.getItem(CacheItem, item.id)).to.deep.equal(item);
  }

  @test 'should dispose cacheItem 1'() {
    const item1 = new CacheItem('hugo1', 'hirsch1');
    const item2 = new CacheItem('hugo2', 'hirsch2');
    this.cacheManager.setItem(CacheItem, item1.id, item1);
    this.cacheManager.setItem(CacheItem, item2.id, item2);
    expect(this.cacheManager.getItem(CacheItem, item1.id)).to.be.undefined;
  }

  @test 'should remove cacheItem'() {
    const item1 = new CacheItem('hugo1', 'hirsch1');
    this.cacheManager.setItem(CacheItem, item1.id, item1);
    this.cacheManager.removeItem(CacheItem, item1.id);
    expect(this.cacheManager.getItem(CacheItem, item1.id)).to.be.undefined;
  }


  public before() {
    const config: IConfig = {
      appenders: [
      ],

      levels: {
        '[all]': 'WARN',
        // 'CacheManager': 'DEBUG',
        // 'LruCache': 'DEBUG'
      }
    };

    configure(config);

    this.cacheManager = new CacheManager({
      cacheType: CacheTypes.LRU,
      configurations: [
        {
          model: CacheItem,
          options: {
            maxItems: 1
          }
        }
      ]
    });
  }

}