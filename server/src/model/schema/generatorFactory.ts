import { NotSupportedException } from '@fluxgate/core';

import { IConfigInfo } from './configInfo';
import { IGenerator } from './generator.interface';
import { KnexGenerator } from './knexGenerator';
import { PojoGenerator } from './pojoGenerator';


export class GeneratorFactory {
  public static create(type: string, outputDir: string, configInfo: IConfigInfo): IGenerator {
    switch (type) {
      case 'pojo':
        return new PojoGenerator(outputDir, configInfo);
      case 'knex':
        return new KnexGenerator(outputDir, configInfo);

      default:
        throw new NotSupportedException('Unsupported generator type: ' + type);
    }
  }
}