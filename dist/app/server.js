"use strict";
/// <reference types="back-lib-foundation" />
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const back_lib_common_util_1 = require("back-lib-common-util");
const back_lib_common_web_1 = require("back-lib-common-web");
const back_lib_id_generator_1 = require("back-lib-id-generator");
const MicroServiceBase_1 = require("back-lib-foundation/dist/app/microservice/MicroServiceBase");
const AccountRepository_1 = require("./persistence/AccountRepository");
const CivilianRepository_1 = require("./persistence/CivilianRepository");
// import { Types as T } from './constants/Types';
const back_lib_membership_contracts_1 = require("back-lib-membership-contracts");
const RoleRepository_1 = require("./persistence/RoleRepository");
const ROLE_REPO = 'membership.IRoleRepository';
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
        this._depContainer.bind(back_lib_common_web_1.Types.AUTH_ADDON, back_lib_common_web_1.AuthAddOn).asSingleton();
        // this.registerMessageBrokerAddOn();
        // this.registerMediateRpcCaller();
        this._depContainer.bind(back_lib_membership_contracts_1.Types.ACCOUNT_REPO, AccountRepository_1.AccountRepository);
        this._depContainer.bind(back_lib_membership_contracts_1.Types.CIVILIAN_REPO, CivilianRepository_1.CivilianRepository);
        this._depContainer.bind(ROLE_REPO, RoleRepository_1.RoleRepository);
        this._depContainer.bind(back_lib_id_generator_1.Types.ID_PROVIDER, back_lib_id_generator_1.IdProvider);
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
        const authAddon = this._depContainer.resolve(back_lib_common_web_1.Types.AUTH_ADDON);
        this.attachAddOn(authAddon);
    }
    /**
     * @override
     */
    onError(error) {
        super.onError(error);
    }
}
new MembershipRestService().start();
