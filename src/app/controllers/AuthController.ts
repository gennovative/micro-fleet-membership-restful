import * as express from 'express';
import { inject } from '@micro-fleet/common';
import { RestControllerBase, AuthAddOn, decorators as d, Types as WT } from '@micro-fleet/web';

import { AccountDTO } from '../models/dto/AccountDTO';
import { LoginViewModel } from '../models/view/LoginViewModel';
import { IAccountRepository } from '../interfaces/IAccountRepository';
import { Types as T } from '../constants/Types';


@d.controller('auth')
export default class AuthController extends RestControllerBase {

	//#region Getters & Setters

	private get repo(): IAccountRepository {
		return this._accRepo;
	}

	//#endregion Getters & Setters


	constructor(
		@inject(T.ACCOUNT_REPO) private _accRepo: IAccountRepository,
		@inject(WT.AUTH_ADDON) private _authAddon: AuthAddOn
	) {
		super();
	}

	@d.POST('login')
	@d.model({ ModelClass: LoginViewModel })
	public async authenticate(req: express.Request, res: express.Response) {
		const credentials = req['model'];
		const account: AccountDTO = await this.repo.findByCredentials(credentials.username, credentials.password);
		if (!account) {
			// TODO 1: Should increase loginAttempt
			// TODO 2: Should lock when exceed login limits
			return this.unauthorized(res);
		}

		const payload: any = {
			accountId: account.id,
			username: account.username,
			role: account.role,
		};
		const [token, refreshToken] = await Promise.all([
			this._authAddon.createToken(payload, false),
			this._authAddon.createToken(payload, true)
		]);
		const loggedAccount = await this.repo.patch({ id: account.id, refreshToken });
		if (loggedAccount) {
			return this.ok(res, {
				username: account.username,
				role: account.role,
				token: token,
				refreshToken: refreshToken
			});
		}
		return this.internalError(res, 'An error occured!');
		//TODO: Should return only username, fullname and roles.
	}

	@d.POST('refresh-token/:id')
	public async refreshToken(req: express.Request, res: express.Response) {
		const refreshToken = req.body.refreshToken;
		const accountId = req.params.id;
		const isTokenValid = await this._accRepo.checkRefresh(accountId, refreshToken);
		if (!isTokenValid) {
			return this.forbidden(res, 'INVALID_REFRESH_TOKEN');
		}
		const account = {
			id: accountId,
			username: req.params['username'],
		};
		const token = await this._authAddon.createToken(account, false);
		return this.ok(res, { token: token });
	}

}