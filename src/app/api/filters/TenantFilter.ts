import TrailsApp = require('trails');
import TrailsPolicy = require('trails/policy');

import { decorators, Types as WT } from 'back-lib-common-web';
import { injectable, inject, decorate, unmanaged,
	IDependencyContainer, Types as CmT } from 'back-lib-common-util';

const { lazyInject } = decorators;


export class TenantFilter {

	@lazyInject(CmT.DEPENDENCY_CONTAINER) private _repo: IDependencyContainer;

	private get tenants() {
		return {
			'enron': '1111',
			'worldcom': '2222',
			'worris': '3333'
		};
	}

	public resolveTenant(req, res, next) {
		console.log('Tenant policy!');

		const { tenant } = req.params;

		// TODO: Look up tenant id by name from db or cache
		if (this.tenants[tenant]) {
			req.params['tenantId'] = this.tenants[tenant];
			// throw new boom.badRequest('That company is evil!')
		}
		next();
	}
}