import {
    Controller, Get, Put, Delete,
    PathParams, Request,
    Authenticated
} from 'ts-express-decorators';

// Fluxgate
import { ServiceResult, Role } from '@fluxgate/common';

import { ControllerBase } from '../controllerBase';
import { RoleService } from '../../services/role.service';


@Controller('/role')
export class RoleController extends ControllerBase<Role, number> {
    constructor(service: RoleService) {
        super(service, 'role', 'role_id');
    }

    // @Authenticated()
    @Get('/')
    public find(
        ): Promise<Role[]> {
        return super.findInternal();
    }

    // @Authenticated()
    @Get('/:id')
    public findById(
        @PathParams('id') id: number
        ): Promise<Role> {
        return super.findByIdInternal(id);
    }

    @Authenticated()
    @Put('/')
    public update(
        @Request() request: Express.Request
        ): Promise<Role> {
        throw new Error(`currently not supported`);
    }

    @Authenticated({ role: 'admin' })
    @Delete('/:id')
    public delete(
        @PathParams('id') id: number
        ): Promise<ServiceResult<number>> {
        throw new Error(`currently not supported`);
    }
}