import { IEntity } from './entity.interface';

export interface IRole extends IEntity {
    name: string;
    description: string;
}