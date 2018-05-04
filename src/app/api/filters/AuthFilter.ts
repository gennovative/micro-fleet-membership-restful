import TrailsApp = require('trails');
import TrailsPolicy = require('trails/policy');

import { decorators, Types as WT } from 'back-lib-common-web';
import { injectable, inject, decorate, unmanaged,
	IDependencyContainer, Types as CmT } from 'back-lib-common-util';

const { lazyInject } = decorators;


export class AuthFilter {

	@lazyInject(CmT.DEPENDENCY_CONTAINER) private _repo: IDependencyContainer;

	public guard(request, response, next) {
		console.log('Guard policy args:', arguments.length);
		next();
	}
}