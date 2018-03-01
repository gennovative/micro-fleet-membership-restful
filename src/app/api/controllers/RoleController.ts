import * as express from 'express';
import TrailsApp = require('trails');

import { injectable, inject, unmanaged, Guard, IDependencyContainer, Types as CmT } from 'back-lib-common-util';
import { SettingItem, SettingItemDataType } from 'back-lib-common-contracts';
import { RestCRUDControllerBase, decorators, Types as WT } from 'back-lib-common-web';
import { IdProvider, Types as IT } from 'back-lib-id-generator';
import { AuthFilter } from 'back-lib-common-web/dist/app/filters/AuthFilter';
// import { ICivilianRepository, CivilianDTO, Types as T } from 'back-lib-membership-contracts';
import { RoleDTO } from '../../dto/RoleDTO';
import { IRoleRepository } from '../../interfaces/IRoleRepository';

// import { CivilianDTO } from '../../dto/CivilianDTO';
// import { Types as T } from '../../constants/Types';
// import { ICivilianRepository } from '../../interfaces/ICivilianRepository';

const { controller, action, filter } = decorators;

const ROLE_REPO = 'membership.IRoleRepository';

@injectable()
@controller('roles')
// @filter(AuthFilter, f => f.guard)
export class RoleController extends RestCRUDControllerBase<RoleDTO> {

	constructor(
		@inject(WT.TRAILS_APP) trailsApp: TrailsApp,
		@inject(ROLE_REPO) private _repo: IRoleRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProvider,
	) {
		super(trailsApp, RoleDTO);
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
	protected doCreate(dto: RoleDTO, req: express.Request, res: express.Response): Promise<RoleDTO & RoleDTO[]> {
		dto = this.translator.merge(dto, {
			id: this._idGen.nextBigInt().toString()
		}) as RoleDTO;
		return this.repo.create(dto);
	}
}