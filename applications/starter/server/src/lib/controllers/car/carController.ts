// tslint:disable:max-classes-per-file

import { Authenticated, Controller, Delete, Get, PathParams, Request } from 'ts-express-decorators';

// Fluxgate
import {
  CreateResult, DeleteResult, FindByIdResult, FindResult, QueryResult, StatusFilter, UpdateResult
} from '@fluxgate/common';
import { IQuery } from '@fluxgate/core';
import {
  ControllerBase, CreateMethod, FindMethod, IBodyRequest, ISessionRequest,
  QueryMethod, UpdateMethod
} from '@fluxgate/server';


import { Car } from '@fluxgate/starter-common';
import { CarService } from '../../services/services';


@Controller('/' + Car.TABLE_NAME)
export class CarController extends ControllerBase<Car, number> {
  constructor(service: CarService) {
    super(service, 'car', 'car_id');
  }

  @Authenticated()
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<Car>
  ): Promise<CreateResult<Car, number>> {
    return super.createInternal(request);
  }

  @Authenticated()
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IQuery>
  ): Promise<QueryResult<Car>> {
    return super.queryInternal(request);
  }

  @Authenticated()
  @FindMethod()
  public find(
    @Request() request: IBodyRequest<StatusFilter>
  ): Promise<FindResult<Car>> {
    return super.findInternal(request);
  }

  @Authenticated()
  @Get('/:id')
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
  ): Promise<FindByIdResult<Car, number>> {
    return super.findByIdInternal(request, id);
  }

  @Authenticated()
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<Car>
  ): Promise<UpdateResult<Car, number>> {
    return super.updateInternal(request);
  }

  @Authenticated({ role: 'admin' })
  @Delete('/:id')
  public delete(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
  ): Promise<DeleteResult<number>> {
    return super.deleteInternal(request, id);
  }
}