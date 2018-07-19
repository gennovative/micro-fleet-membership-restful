import * as express from 'express';
import * as joi from 'joi';

import { inject, PagedArray, ModelAutoMapper } from '@micro-fleet/common';
import { RestControllerBase, decorators as d } from '@micro-fleet/web';
import { IdProviderAddOn, Types as IT } from '@micro-fleet/id-generator';

import { AccountDTO } from '../dto/AccountDTO';
import { IAccountRepository } from '../interfaces/IAccountRepository';
import { Types as T } from '../constants/Types';


@d.controller('accounts')
// @d.authorized()
export default class AccountController extends RestControllerBase {

	//#region Getters & Setters

	private get repo(): IAccountRepository {
		return this._accRepo;
	}

	private get trans(): ModelAutoMapper<AccountDTO> {
		return AccountDTO.translator;
	}

	//#endregion Getters & Setters


	constructor(
		@inject(T.ACCOUNT_REPO) private _accRepo: IAccountRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProviderAddOn
	) {
		super();
	}

	/**
	 * For testing this endpoint.
	 */
	@d.ALL('ping')
	public ping(req: express.Request, res: express.Response) {
		return res.status(200).json('pong');
	}


	//#region Basic CRUD operations
	
	/**
	 * GET /accounts/countAll
	 */
	@d.GET('countAll')
	public async countAll(req: express.Request, res: express.Response) {
		const nRows: number = await this.repo.countAll();
		this.ok(res, nRows);
	}

	/**
	 * POST /accounts
	 */
	@d.POST('/')
	@d.model({ ModelClass: AccountDTO })
	public async create(req: express.Request, res: express.Response) {
		const dto = this.trans.merge(req['model'], {
			id: this._idGen.nextBigInt().toString()
		}) as AccountDTO;

		const createdDto = await this.repo.create(dto);
		this.created(res, createdDto);
	}

	/**
	 * DELETE /accounts/:id
	 */
	@d.DELETE(':id')
	public async deleteSoft(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = AccountDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.deleteSoft(pk);
		this.ok(res, nRows);
	}

	/**
	 * DELETE /accounts/hard/:id
	 */
	@d.DELETE('hard/:id')
	public async deleteHard(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = AccountDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.deleteHard(pk);
		this.ok(res, nRows);
	}

	/**
	 * GET /accounts/exists?name=Gennova
	 */
	@d.GET('exists')
	public async exists(req: express.Request, res: express.Response) {
		const uniqueProps = req.query;
		const gotIt: boolean = await this.repo.exists(uniqueProps);
		this.ok(res, gotIt);
	}

	/**
	 * GET /accounts/:id
	 */
	@d.GET(':id')
	public async findByPk(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = AccountDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const dto: AccountDTO = await this.repo.findByPk(pk);
		this.ok(res, dto);
	}

	/**
	 * GET /accounts/recover/:id
	 */
	@d.GET('recover/:id')
	public async recover(req: express.Request, res: express.Response) {
		const id = req.params.id,
			[err, pk] = AccountDTO.validator.pk(id);
		if (err) {
			this.validationError(res, err);
			return;
		}

		const nRows: number = await this.repo.recover(pk);
		this.ok(res, nRows);
	}

	/**
	 * GET /accounts/page/2/20/name/desc
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

		const result: PagedArray<AccountDTO> = await this.repo.page(pageIndex, pageSize, {
			sortBy, sortType
		});
		this.ok(res, result ? result.asObject() : new PagedArray<AccountDTO>());
	}

	/**
	 * PATCH /accounts
	 */
	@d.PATCH('/')
	@d.model({
		ModelClass: AccountDTO,
		isPartial: true
	})
	public async patch(req: express.Request, res: express.Response) {
		const props = req['mode'] as Partial<AccountDTO>;
		if (props.hasOwnProperty('password')) {
			return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
		}

		const updatedProps: Partial<AccountDTO> = await this.repo.patch(props);
		this.ok(res, updatedProps);
	}

	/**
	 * PUT /accounts
	 */
	@d.PUT('/')
	@d.model({ ModelClass: AccountDTO })
	public async update(req: express.Request, res: express.Response) {
		const dto = req['mode'] as AccountDTO;
		if (dto.hasOwnProperty('password')) {
			return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
		}
		const updatedModel: AccountDTO = await this.repo.update(dto);
		this.ok(res, updatedModel);
	}

	//#endregion Basic CRUD operations
}