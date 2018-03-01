import * as express from 'express';
import TrailsApp = require('trails');

import { injectable, inject, unmanaged, Guard, IDependencyContainer, Types as CmT } from 'back-lib-common-util';
import { SettingItem, SettingItemDataType, IRepository } from 'back-lib-common-contracts';
import { RestCRUDControllerBase, AuthAddOn, decorators, Types as WT } from 'back-lib-common-web';
import { IdProvider, Types as IT } from 'back-lib-id-generator';

// import { AccountDTO } from '../../dto/AccountDTO';
// import { IAccountRepository } from '../../interfaces/IAccountRepository';
import { IAccountRepository, AccountDTO, Types as T } from 'back-lib-membership-contracts';
import { AccountRepository } from '../../persistence/AccountRepository';
import { IRoleRepository } from '../../interfaces/IRoleRepository';
// import { Types as T } from '../../constants/Types';

const { controller, action } = decorators;
const ROLE_REPO = 'membership.IRoleRepository';


@injectable()
@controller('accounts')
export class AccountController extends RestCRUDControllerBase<AccountDTO> {

	constructor(
		@inject(WT.TRAILS_APP) trailsApp: TrailsApp,
		@inject(T.ACCOUNT_REPO) private _repo: IAccountRepository,
		@inject(ROLE_REPO) private _roleRepo: IRoleRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProvider,
		@inject(WT.AUTH_ADDON) private _authAddon: AuthAddOn
	) {
		super(trailsApp, AccountDTO);
	}

	@action('POST', 'login')
	public async authenticate(req: express.Request, res: express.Response) {
		let body = req.body;
		let account = await this._repo.findByCredentials(body.username, body.password);
		let role = await this._roleRepo.findByPk(account.roleId);
		if (account) {
			let token = await this._authAddon.createToken(account);
			// let refreshToken = await this._authAddon.createToken(account);
			return this.ok(res, { token: token, role: role.name });
		}
		return this.unauthorized(res);
		//TODO: Should return only username, fullname and roles.
	}

	/**
	 * @override
	 */
	protected doCreate(dto: AccountDTO, req: express.Request, res: express.Response): Promise<AccountDTO & AccountDTO[]> {
		dto = this.translator.merge(dto, {
			id: this._idGen.nextBigInt().toString()
		}) as AccountDTO;
		return this.repo.create(dto);
	}
}