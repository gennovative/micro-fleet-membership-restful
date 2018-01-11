import * as express from 'express';
import TrailsApp = require('trails');

import { injectable, inject, Guard, IDependencyContainer, Types as CmT } from 'back-lib-common-util';
import { SettingItem, SettingItemDataType } from 'back-lib-common-contracts';
import { RestCRUDControllerBase, decorators, Types as WT } from 'back-lib-common-web';

import { AccountDTO } from '../../dto/AccountDTO';
import { IAccountRepository } from '../../interfaces/IAccountRepository';
import { AccountRepository } from '../../persistence/AccountRepository';
import { Types as T } from '../../constants/Types';

const { controller, action } = decorators;


@injectable()
@controller('program')
class AccountController extends RestCRUDControllerBase<AccountDTO> {

	constructor(
		trailsApp: TrailsApp,
		@inject(T.ACCOUNT_REPO) private _repo: IAccountRepository
	) {
		super(trailsApp);
	}

	@action('POST')
	public async authenticate(req: express.Request, res: express.Response) {
		let body = req.body;
		let account = this._repo.findByCredentials(body.username, body.password);
		if (!account) {
			return this.unauthorized(res);
		}
		//TODO: Should return only username, fullname and roles.
		return this.ok(res, account);
	}

	
}