import * as express from 'express';
import { decorators, Types as WT } from 'back-lib-common-web';
const { lazyInject } = decorators;

import { AuthAddOn } from './AuthAddOn';
import { Types as aT } from './Types';


export class AuthFilter {

	@lazyInject(aT.AUTH_ADDON) private _authAddon: AuthAddOn;

	public async guard(request: express.Request, response: express.Response, next: Function) {
		try {
			const authResult = await this._authAddon.authenticate(request, response, next);
			if (!authResult || !authResult.payload) {
				//console.log('Auth fail. Status:', authResult.status, '.Info:', authResult.info);
				return response.status(401).send(authResult.info.message);
			}
			request.params['accountId'] = authResult.payload.accountId;
			request.params['username'] = authResult.payload.username;
			next();
		} catch (error) {
			// response status 401 Unthorized
		}
	}
}