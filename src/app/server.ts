// import 'reflect-metadata';

import { Types as IT, IdProviderAddOn } from '@micro-fleet/id-generator';
import { MicroServiceBase } from '@micro-fleet/microservice';
import { registerDbAddOn } from '@micro-fleet/persistence';
import { AuthAddOn, Types as WT } from '@micro-fleet/web';

import { IAccountRepository } from './interfaces/IAccountRepository';
import { ICivilianRepository } from './interfaces/ICivilianRepository';
import { IRoleRepository } from './interfaces/IRoleRepository';
import { AccountRepository } from './persistence/AccountRepository';
import { CivilianRepository } from './persistence/CivilianRepository';
import { RoleRepository } from './persistence/RoleRepository';

import { Types as T } from './constants/Types';


class MembershipRestService extends MicroServiceBase {

	/**
	 * @override
	 */
	protected registerDependencies(): void {
		super.registerDependencies();

		this._depContainer.bind<AuthAddOn>(WT.AUTH_ADDON, AuthAddOn).asSingleton();
		this._depContainer.bind<IdProviderAddOn>(IT.ID_PROVIDER, IdProviderAddOn).asSingleton();
		this._depContainer.bind<IAccountRepository>(T.ACCOUNT_REPO, AccountRepository);
		this._depContainer.bind<ICivilianRepository>(T.CIVILIAN_REPO, CivilianRepository);
		this._depContainer.bind<IRoleRepository>(T.ROLE_REPO, RoleRepository);
	}

	/**
	 * @override
	 */
	protected onStarting(): void {
		super.onStarting();

		// IMPORTANT - Default is `false`
		this._configProvider.enableRemote = false;
		registerDbAddOn();

		// TODO: Should have registerAuthAddOn
		const authAddon = this._depContainer.resolve<AuthAddOn>(WT.AUTH_ADDON);
		this.attachAddOn(authAddon);
	}

	/**
	 * @override
	 */
	protected onError(error: any): void {
		super.onError(error);
	}

}

new MembershipRestService().start();