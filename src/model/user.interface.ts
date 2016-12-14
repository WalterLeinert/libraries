import { IEntity } from './entity.interface';

export interface IUser extends IEntity {
    id: number; 

    username: string;

    role: number;

    password: string;

    password_salt: string;
}