"use strict";
/// <reference types="back-lib-foundation" />
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const back_lib_common_util_1 = require("back-lib-common-util");
const back_lib_common_web_1 = require("back-lib-common-web");
const MicroServiceBase_1 = require("back-lib-foundation/dist/app/microservice/MicroServiceBase");
const AccountRepository_1 = require("./persistence/AccountRepository");
const Types_1 = require("./constants/Types");
class MembershipRestService extends MicroServiceBase_1.MicroServiceBase {
    /**
     * @override
     */
    registerDependencies() {
        super.registerDependencies();
        // Must go together
        const appOpts = require('./index');
        this._depContainer.bindConstant(back_lib_common_web_1.Types.TRAILS_OPTS, appOpts);
        this.registerTrailsAddOn();
        this.registerDbAddOn();
        // this.registerMessageBrokerAddOn();
        // this.registerMediateRpcCaller();
        this._depContainer.bind(Types_1.Types.ACCOUNT_REPO, AccountRepository_1.AccountRepository);
    }
    /**
     * @override
     */
    onStarting() {
        super.onStarting();
        back_lib_common_util_1.HandlerContainer.instance.dependencyContainer = this._depContainer;
        // IMPORTANT - Default is `false`
        this._configProvider.enableRemote = false;
        this.attachDbAddOn();
        // this.attachMessageBrokerAddOn();
        let trails = this.attachTrailsAddOn();
        trails.pathPrefix = '/api/v1';
        // trails.addFilter(TestFilter, f => f.sayHi);
    }
    /**
     * @override
     */
    onError(error) {
        super.onError(error);
    }
}
new MembershipRestService().start();
