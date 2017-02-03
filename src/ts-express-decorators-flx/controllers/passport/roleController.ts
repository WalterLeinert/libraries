import {
    Authenticated, Controller, Delete, Get,
    PathParams, Put,
    Request
} from 'ts-express-decorators';

// Fluxgate
import { Role, ServiceResult } from '@fluxgate/common';

import { RoleService } from '../../services/role.service';
import { ControllerBase } from '../controllerBase';


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