/**
 * Policies Configuration
 * (app.config.footprints)
 *
 * Define which prerequisites a request must pass before reaching the intended
 * controller action. By default, no policies are configured for controllers or
 * footprints, therefore the request always will directly reach the intended
 * handler.
 *
 * @see http://trailsjs.io/doc/config/policies
 */

import { HandlerContainer } from 'back-lib-common-util';
import { Types as T } from '../constants/Types';


const container = HandlerContainer.instance;

export = {

	// '*': ['TestPolicy.sayHi'],
	// '*': container.register('resolveTenant', T.TEST_POLICY)
	// DefaultController: {
	// 	'*': [
	// 		'TestPolicy.resolveTenant'
	// 	]
	// }
	ProgramController: {
		'*': ['TenantPolicy.resolveTenant'],
		'assignToGroup': ['AuthPolicy.guard']
	}
};
