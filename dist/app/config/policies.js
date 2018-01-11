"use strict";
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
const back_lib_common_util_1 = require("back-lib-common-util");
const container = back_lib_common_util_1.HandlerContainer.instance;
module.exports = {
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
