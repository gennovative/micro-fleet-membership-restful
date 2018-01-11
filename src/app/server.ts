/// <reference types="back-lib-foundation" />

import 'reflect-metadata';
import TrailsApp = require('trails');

import { HandlerContainer } from 'back-lib-common-util';
import { TrailsServerAddOn, Types as WT } from 'back-lib-common-web';
import { MicroServiceBase } from 'back-lib-foundation/dist/app/microservice/MicroServiceBase';

import { IAccountRepository } from './interfaces/IAccountRepository';
import { AccountRepository } from './persistence/AccountRepository';
import { Types as T } from './constants/Types';


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

		// this.registerMessageBrokerAddOn();
		// this.registerMediateRpcCaller();
		this._depContainer.bind<IAccountRepository>(T.ACCOUNT_REPO, AccountRepository);
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
	}

	/**
	 * @override
	 */
	protected onError(error: any): void {
		super.onError(error);
	}

}

new MembershipRestService().start();