import { Funktion } from '../base/objectType';
import { CacheType } from './cache-type';

export interface ICacheManagerConfiguration {


  cacheType: CacheType;

  configurations: [
    {
      cacheType?: CacheType;
      model: string | Funktion;
      options: any;
    }
  ];
}