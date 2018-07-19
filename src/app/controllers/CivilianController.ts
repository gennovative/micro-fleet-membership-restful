import * as express from 'express';
import * as joi from 'joi';

import { injectable, inject, PagedArray, ModelAutoMapper } from '@micro-fleet/common';
import { RestControllerBase, decorators as d } from '@micro-fleet/web';
import { IdProviderAddOn, Types as IT } from '@micro-fleet/id-generator';

import { CivilianDTO } from '../dto/CivilianDTO';
import { ICivilianRepository } from '../interfaces/ICivilianRepository';
import { Types as T } from '../constants/Types';


@injectable()
@d.controller('civilians')
@d.authorized()
export class CivilianController extends RestControllerBase {

	//#region Getters & Setters

	private get repo(): ICivilianRepository {
		return this._cilRepo;
	}

	private get trans(): ModelAutoMapper<CivilianDTO> {
		return CivilianDTO.translator;
	}

	//#endregion Getters & Setters


	constructor(
		@inject(T.CIVILIAN_REPO) private _cilRepo: ICivilianRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProviderAddOn,
	) {
		super();
	}


	//#region Basic CRUD operations
	
	/**
	 * GET /civilians/countAll
	 */
	@d.GET('countAll')
	public async countAll(req: express.Request, res: express.Response) {
		const nRows: number = await this.repo.countAll();
		this.ok(res, nRows);
	}

	/**
	 * POST /civilians
	 */
	@d.POST()
	@d.model({ ModelClass: CivilianDTO })
	public async create(req: express.Request, res: express.Response) {
		const dto = this.trans.merge(req['model'], {
			id: this._idGen.nextBigInt().toString()
		}) as CivilianDTO;

		const createdDto = await this.repo.create(dto);
		this.created(res, createdDto);
	}

	/**
	 * DELETE /civilians/:id
	 */
	@d.DELETE(':id')
	public async deleteSoft(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = CivilianDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.deleteSoft(pk);
		this.ok(res, nRows);
	}

	/**
	 * DELETE /civilians/hard/:id
	 */
	@d.DELETE('hard/:id')
	public async deleteHard(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = CivilianDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.deleteHard(pk);
		this.ok(res, nRows);
	}

	/**
	 * GET /civilians/exists?name=Gennova
	 */
	@d.GET('exists')
	public async exists(req: express.Request, res: express.Response) {
		const uniqueProps = req.query;
		const gotIt: boolean = await this.repo.exists(uniqueProps);
		this.ok(res, gotIt);
	}

	/**
	 * GET /civilians/:id
	 */
	@d.GET(':id')
	public async findByPk(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = CivilianDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const dto: CivilianDTO = await this.repo.findByPk(pk);
		this.ok(res, dto);
	}

	/**
	 * GET /civilians/recover/:id
	 */
	@d.GET('recover/:id')
	public async recover(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = CivilianDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.recover(pk);
		this.ok(res, nRows);
	}

	/**
	 * GET /civilians/page/2/20/name/desc
	 */
	@d.GET('page/:pageIndex?/:pageSize?/:sortBy?/:sortType?')
	public async page(req: express.Request, res: express.Response) {
		let pageIndex, pageSize, sortBy, sortType, error;

		({value: pageIndex, error} = joi.number().min(1).default(1).validate(req.params.pageIndex));
		if (error) { throw error; }

		({value: pageSize, error} = joi.number().min(10).max(100).default(25).validate(req.params.pageSize));
		if (error) { throw error; }

		({value: sortBy, error} = joi.string().min(1).validate(req.params.sortBy));
		if (error) { throw error; }

		({value: sortType, error} = joi.string().valid('asc', 'desc').validate(req.params.sortType));
		if (error) { throw error; }

		const result: PagedArray<CivilianDTO> = await this.repo.page(pageIndex, pageSize, {
			sortBy, sortType
		});
		this.ok(res, result ? result.asObject() : new PagedArray<CivilianDTO>());
	}

	/**
	 * PATCH /civilians
	 */
	@d.PATCH()
	@d.model({
		ModelClass: CivilianDTO,
		isPartial: true
	})
	public async patch(req: express.Request, res: express.Response) {
		const props = req['mode'] as Partial<CivilianDTO>;
		if (props.hasOwnProperty('password')) {
			return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
		}

		const updatedProps: Partial<CivilianDTO> = await this.repo.patch(props);
		this.ok(res, updatedProps);
	}

	/**
	 * PUT /civilians
	 */
	@d.PUT()
	@d.model({ ModelClass: CivilianDTO })
	public async update(req: express.Request, res: express.Response) {
		const dto = req['mode'] as CivilianDTO;
		if (dto.hasOwnProperty('password')) {
			return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
		}
		const updatedModel: CivilianDTO = await this.repo.update(dto);
		this.ok(res, updatedModel);
	}

	//#endregion Basic CRUD operations

}