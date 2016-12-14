import { IEntity } from './entity.interface';

export interface IUser extends IEntity {
    username: string;

    role: number;

    password: string;

    password_salt: string;
}