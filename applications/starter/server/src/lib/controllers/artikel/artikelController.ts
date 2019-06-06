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


import { Artikel } from '@fluxgate/starter-common';
import { ArtikelService } from '../../services/services';


@Controller('/' + Artikel.TABLE_NAME)
export class ArtikelController extends ControllerBase<Artikel, number> {
  constructor(service: ArtikelService) {
    super(service, 'artikel', 'artikel_id');
  }

  @Authenticated()
  @CreateMethod()
  public create(
    @Request() request: IBodyRequest<Artikel>
  ): Promise<CreateResult<Artikel, number>> {
    return super.createInternal(request);
  }

  @Authenticated()
  @QueryMethod()
  public query(
    @Request() request: IBodyRequest<IQuery>
  ): Promise<QueryResult<Artikel>> {
    return super.queryInternal(request);
  }

  @Authenticated()
  @FindMethod()
  public find(
    @Request() request: IBodyRequest<StatusFilter>
  ): Promise<FindResult<Artikel>> {
    return super.findInternal(request);
  }

  @Authenticated()
  @Get('/:id')
  public findById(
    @Request() request: ISessionRequest,
    @PathParams('id') id: number
  ): Promise<FindByIdResult<Artikel, number>> {
    return super.findByIdInternal(request, id);
  }

  @Authenticated()
  @UpdateMethod()
  public update(
    @Request() request: IBodyRequest<Artikel>
  ): Promise<UpdateResult<Artikel, number>> {
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