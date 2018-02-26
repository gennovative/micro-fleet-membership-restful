import * as express from 'express';
import TrailsApp = require('trails');

import { injectable, inject, unmanaged, Guard, IDependencyContainer, Types as CmT } from 'back-lib-common-util';
import { SettingItem, SettingItemDataType } from 'back-lib-common-contracts';
import { RestCRUDControllerBase, decorators, Types as WT } from 'back-lib-common-web';
import { IdProvider, Types as IT } from 'back-lib-id-generator';

import { AccountDTO } from '../../dto/AccountDTO';
import { IAccountRepository } from '../../interfaces/IAccountRepository';
import { AccountRepository } from '../../persistence/AccountRepository';
import { Types as T } from '../../constants/Types';
import { AuthAddOn } from '../../auth/AuthAddOn';
import { Types as aT } from '../../auth/Types';

const { controller, action } = decorators;


@injectable()
@controller('accounts')
export class AccountController extends RestCRUDControllerBase<AccountDTO> {

	constructor(
		@inject(WT.TRAILS_APP) trailsApp: TrailsApp,
		@inject(T.ACCOUNT_REPO) private _repo: IAccountRepository,
		@inject(IT.ID_PROVIDER) private _idGen: IdProvider,
		@inject(aT.AUTH_ADDON) private _authAddon: AuthAddOn
	) {
		super(trailsApp, AccountDTO);
	}

	@action('POST', 'login')
	public async authenticate(req: express.Request, res: express.Response) {
		let body = req.body;
		let account = await this._authAddon.login(body.username, body.password);
		if (!account) {
			return this.unauthorized(res);
		}
		//TODO: Should return only username, fullname and roles.
		return this.ok(res, account);
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