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
import { AuthFilter } from 'back-lib-common-web/dist/app/filters/AuthFilter';
// import { Types as T } from '../../constants/Types';

const { controller, action, filter } = decorators;
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
		if (account) {
			let [token, refreshToken] = await Promise.all([
				this._authAddon.createToken(account, false),
				this._authAddon.createToken(account, true)
			]);
			// let token = await this._authAddon.createToken(account, false);
			// let refreshToken = await this._authAddon.createToken(account, true);
			let loggedAccount = await this._repo.patch({ id: account.id, refreshToken: refreshToken });
			if (loggedAccount) {
				return this.ok(res, {
					id: account.id,
					// username: account.username,
					role: account.role,
					token: token,
					refreshToken: refreshToken
				});
			}
			return this.internalError(res, 'An error occured!');
		}
		return this.unauthorized(res);
		//TODO: Should return only username, fullname and roles.
	}

	@action('POST', 'refresh-token')
	@filter(AuthFilter, f => f.guard)
	public async refreshToken(req: express.Request, res: express.Response) {
		let refreshToken = req.body.refreshToken;
		let checkToken = await this._repo.checkRefresh(req.params['accountId'], refreshToken);
		let account = {
			id: req.params['accountId'],
			username: req.params['username'],
		};
		let token = await this._authAddon.createToken(account, false);
		return this.ok(res, { token: token });
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