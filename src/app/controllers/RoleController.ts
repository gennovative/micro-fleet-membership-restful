import * as express from 'express'
import * as joi from 'joi'

import { inject, PagedArray, ModelAutoMapper } from '@micro-fleet/common'
import { RestControllerBase, decorators as d } from '@micro-fleet/web'
import { IdProviderAddOn, Types as IT } from '@micro-fleet/id-generator'
import { authorized } from '@micro-fleet/oauth'

import { RoleDTO } from '../models/dto/RoleDTO'
import { IRoleRepository } from '../interfaces/IRoleRepository'
import { Types as T } from '../constants/Types'


@d.controller('roles')
@authorized()
export default class RoleController extends RestControllerBase {

    //#region Getters & Setters

    private get repo(): IRoleRepository {
        return this._roleRepo
    }

    private get trans(): ModelAutoMapper<RoleDTO> {
        return RoleDTO.translator
    }

    //#endregion Getters & Setters


    constructor(
        @inject(T.ROLE_REPO) private _roleRepo: IRoleRepository,
        @inject(IT.ID_PROVIDER) private _idGen: IdProviderAddOn,
    ) {
        super()
    }


    /**
     * For testing this endpoint.
     */
    @d.ALL('ping')
    public ping(req: express.Request, res: express.Response) {
        this.ok(res, 'pong')
    }


    //#region Basic CRUD operations

    /**
     * GET /roles/countAll
     */
    @d.GET('countAll')
    public async countAll(req: express.Request, res: express.Response) {
        const nRows: number = await this.repo.countAll()
        this.ok(res, nRows)
    }

    /**
     * POST /roles
     */
    @d.POST('/')
    @d.model({ ModelClass: RoleDTO })
    public async create(req: express.Request, res: express.Response) {
        const dto = this.trans.merge(req['model'], {
            id: this._idGen.nextBigInt(),
        }) as RoleDTO

        const createdDto = await this.repo.create(dto)
        this.created(res, createdDto)
    }

    /**
     * DELETE /roles/:id
     */
    @d.DELETE(':id')
    public async deleteHard(req: express.Request, res: express.Response) {
        const id = req.params.id,
            [err, pk] = RoleDTO.validator.pk(id)
        if (err) {
            this.validationError(res, err)
            return
        }

        const nRows: number = await this.repo.deleteHard(pk)
        this.ok(res, nRows)
    }

    /**
     * GET /roles/exists?name=Gennova
     */
    @d.GET('exists')
    public async exists(req: express.Request, res: express.Response) {
        const uniqueProps = req.query
        const gotIt: boolean = await this.repo.exists(uniqueProps)
        this.ok(res, gotIt)
    }

    /**
     * GET /roles/:id
     */
    @d.GET(':id')
    public async findByPk(req: express.Request, res: express.Response) {
        const id = req.params.id,
            [err, pk] = RoleDTO.validator.pk(id)
        if (err) {
            this.validationError(res, err)
            return
        }

        const dto: RoleDTO = await this.repo.findByPk(pk)
        this.ok(res, dto)
    }

    /**
     * GET /roles/page/2/20/name/desc
     */
    @d.GET('page/:pageIndex?/:pageSize?/:sortBy?/:sortType?')
    public async page(req: express.Request, res: express.Response) {
        let pageIndex, pageSize, sortBy, sortType, error

        ({value: pageIndex, error} = joi.number().min(1).default(1).validate(req.params.pageIndex))
        if (error) { throw error }

        ({value: pageSize, error} = joi.number().min(10).max(100).default(25).validate(req.params.pageSize))
        if (error) { throw error }

        ({value: sortBy, error} = joi.string().min(1).validate(req.params.sortBy))
        if (error) { throw error }

        ({value: sortType, error} = joi.string().valid('asc', 'desc').validate(req.params.sortType))
        if (error) { throw error }

        const result: PagedArray<RoleDTO> = await this.repo.page(pageIndex, pageSize, {
            sortBy, sortType,
        })
        this.ok(res, result ? result.asObject() : new PagedArray<RoleDTO>())
    }

    /**
     * PATCH /roles
     */
    @d.PATCH('/')
    @d.model({
        ModelClass: RoleDTO,
        isPartial: true,
    })
    public async patch(req: express.Request, res: express.Response) {
        const props = req['mode'] as Partial<RoleDTO>
        if (props.hasOwnProperty('password')) {
            return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT')
        }

        const updatedProps = await this.repo.patch(props) as Partial<RoleDTO>
        this.ok(res, updatedProps)
    }

    /**
     * PUT /roles
     */
    @d.PUT('/')
    @d.model({ ModelClass: RoleDTO })
    public async update(req: express.Request, res: express.Response) {
        const dto = req['mode'] as RoleDTO
        if (dto.hasOwnProperty('password')) {
            return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT')
        }
        const updatedModel = await this.repo.update(dto) as RoleDTO
        this.ok(res, updatedModel)
    }

    //#endregion Basic CRUD operations

}
