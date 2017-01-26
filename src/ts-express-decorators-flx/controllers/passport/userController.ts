import {
    Controller, Get, Put, Delete,
    PathParams, Request,
    Authenticated
} from 'ts-express-decorators';

// Fluxgate
import { ControllerBase } from '../controllerBase';

import { User, IUser } from '@fluxgate/common';
import { UserService } from '../../services/user.service';


@Controller('/user')
export class UserController extends ControllerBase<IUser, number> {
    constructor(service: UserService) {
        super(service, 'user', 'user_id');
    }

    // @Authenticated()
    @Get('/')
    public find(
        ): Promise<User[]> {
        return super.findInternal();
    }

    // @Authenticated()
    @Get('/:id')
    public findById(
        @PathParams('id') id: number
        ): Promise<User> {
        return super.findByIdInternal(id);
    }

    @Authenticated()
    @Put('/')
    public update(
        @Request() request: Express.Request
        ): Promise<User> {
        throw new Error(`currently not supported`);
    }

    @Authenticated({ role: 'admin' })
    @Delete('/:id')
    public delete(
        @PathParams('id') id: number
        ): Promise<number> {
        throw new Error(`currently not supported`);
    }
}