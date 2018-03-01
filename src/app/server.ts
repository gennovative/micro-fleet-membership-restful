/// <reference types="back-lib-foundation" />

import 'reflect-metadata';
import TrailsApp = require('trails');

import { HandlerContainer } from 'back-lib-common-util';
import { TrailsServerAddOn, AuthAddOn, Types as WT } from 'back-lib-common-web';
import { Types as IT, IdProvider } from 'back-lib-id-generator';
import { MicroServiceBase } from 'back-lib-foundation/dist/app/microservice/MicroServiceBase';

import { AccountRepository } from './persistence/AccountRepository';
import { CivilianRepository } from './persistence/CivilianRepository';
// import { Types as T } from './constants/Types';
import { IAccountRepository, ICivilianRepository, Types as T } from 'back-lib-membership-contracts';
import { IRoleRepository } from './interfaces/IRoleRepository';
import { RoleRepository } from './persistence/RoleRepository';

const ROLE_REPO = 'membership.IRoleRepository';


class MembershipRestService extends MicroServiceBase {

	/**
	 * @override
	 */
	protected registerDependencies(): void {
		super.registerDependencies();

		// Must go together
		const appOpts = require('./index');
		this._depContainer.bindConstant<TrailsApp.TrailsAppOts>(WT.TRAILS_OPTS, appOpts);
		this.registerTrailsAddOn();
		this.registerDbAddOn();

		this._depContainer.bind<AuthAddOn>(WT.AUTH_ADDON, AuthAddOn).asSingleton();

		// this.registerMessageBrokerAddOn();
		// this.registerMediateRpcCaller();
		this._depContainer.bind<IAccountRepository>(T.ACCOUNT_REPO, AccountRepository);
		this._depContainer.bind<ICivilianRepository>(T.CIVILIAN_REPO, CivilianRepository);
		this._depContainer.bind<IRoleRepository>(ROLE_REPO, RoleRepository);
		this._depContainer.bind<IdProvider>(IT.ID_PROVIDER, IdProvider);
	}

	/**
	 * @override
	 */
	protected onStarting(): void {
		super.onStarting();

		HandlerContainer.instance.dependencyContainer = this._depContainer;

		// IMPORTANT - Default is `false`
		this._configProvider.enableRemote = false;
		this.attachDbAddOn();
		
		// this.attachMessageBrokerAddOn();
		let trails: TrailsServerAddOn = this.attachTrailsAddOn();
		trails.pathPrefix = '/api/v1';
		// trails.addFilter(TestFilter, f => f.sayHi);

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