/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */

import { HandlerContainer } from 'back-lib-common-util';
import { RestCRUDControllerBase } from 'back-lib-common-web';
import { Types as T } from '../constants/Types';

const PATH_PREFIX = '/api/v1';

const container = HandlerContainer.instance;

export = [
	// {
	// 	method: ['GET'],
	// 	path: '/api/v1/:tenant/countAll',
	// 	handler: 'DefaultController.countAll'
	// }
	// ...RestCRUDControllerBase.createRouteConfigs(T.DEFAULT_CONTROLLER, true, PATH_PREFIX)
];
