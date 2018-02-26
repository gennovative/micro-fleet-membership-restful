import * as express from 'express';
import TrailsApp = require('trails');

import { injectable, inject, unmanaged, Guard, IDependencyContainer, Types as CmT } from 'back-lib-common-util';
import { SettingItem, SettingItemDataType } from 'back-lib-common-contracts';
import { RestCRUDControllerBase, decorators, Types as WT } from 'back-lib-common-web';
import { IdProvider, Types as IT } from 'back-lib-id-generator';

import { CivilianDTO } from '../../dto/CivilianDTO';
import { Types as T } from '../../constants/Types';
import { ICivilianRepository } from '../../interfaces/ICivilianRepository';
import { AuthFilter } from '../../auth/AuthFilter';

const { controller, action, filter } = decorators;


@injectable()
@controller('civilians')
@filter(AuthFilter, f => f.guard)
export class CivilianController extends RestCRUDControllerBase<CivilianDTO> {

	constructor(
		@inject(WT.TRAILS_APP) trailsApp: TrailsApp,
		@inject(T.CIVILIAN_REPO) private _repo: ICivilianRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProvider,
	) {
		super(trailsApp, CivilianDTO);
	}

	// @action('POST', 'login')
	// public async authenticate(req: express.Request, res: express.Response) {
	// 	let body = req.body;
	// 	let account = this._repo.findByCredentials(body.username, body.password);
	// 	if (!account) {
	// 		return this.unauthorized(res);
	// 	}
	// 	//TODO: Should return only username, fullname and roles.
	// 	return this.ok(res, account);
	// }

	/**
	 * @override
	 */
	protected doCreate(dto: CivilianDTO, req: express.Request, res: express.Response): Promise<CivilianDTO & CivilianDTO[]> {
		dto = this.translator.merge(dto, {
			id: this._idGen.nextBigInt().toString()
		}) as CivilianDTO;
		return this.repo.create(dto);
	}
}