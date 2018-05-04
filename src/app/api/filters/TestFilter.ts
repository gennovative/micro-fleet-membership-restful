import TrailsApp = require('trails');
import TrailsPolicy = require('trails/policy');

import { decorators, Types as WT } from 'back-lib-common-web';
import { injectable, inject, decorate, unmanaged,
	IDependencyContainer, Types as CmT } from 'back-lib-common-util';

const { lazyInject } = decorators;

@injectable()
export class TestFilter {

	constructor(
		@inject(CmT.DEPENDENCY_CONTAINER) private _repo: IDependencyContainer) {
	}

	public sayHi(request, response, next) {
		console.log('Test policy args:', arguments.length);
		next();
	}
}