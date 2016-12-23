import { IGenerator } from './generator.interface';
import { IConfigInfo } from './configInfo';
import { PojoGenerator } from './pojoGenerator';
import { KnexGenerator } from './knexGenerator';


export class GeneratorFactory {
    public static create(type: string, outputDir: string, configInfo: IConfigInfo): IGenerator {
        switch (type) {
            case 'pojo':
                return new PojoGenerator(outputDir, configInfo);
            case 'knex':
                return new KnexGenerator(outputDir, configInfo);

            default:
                throw new Error('Unsupported generator type: ' + type);
        }
    }
}