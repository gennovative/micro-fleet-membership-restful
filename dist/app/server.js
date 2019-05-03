"use strict";
// import 'reflect-metadata'
Object.defineProperty(exports, "__esModule", { value: true });
const id_generator_1 = require("@micro-fleet/id-generator");
const microservice_1 = require("@micro-fleet/microservice");
const persistence_1 = require("@micro-fleet/persistence");
const oauth_1 = require("@micro-fleet/oauth");
const web_1 = require("@micro-fleet/web");
const AccountRepository_1 = require("./persistence/AccountRepository");
const CivilianRepository_1 = require("./persistence/CivilianRepository");
const RoleRepository_1 = require("./persistence/RoleRepository");
const Types_1 = require("./constants/Types");
class MembershipRestService extends microservice_1.MicroServiceBase {
    /**
     * @override
     */
    registerDependencies() {
        super.registerDependencies();
        this._depContainer.bind(oauth_1.Types.AUTH_ADDON, oauth_1.AuthAddOn).asSingleton();
        this._depContainer.bind(id_generator_1.Types.ID_PROVIDER, id_generator_1.IdProviderAddOn).asSingleton();
        this._depContainer.bind(Types_1.Types.ACCOUNT_REPO, AccountRepository_1.AccountRepository);
        this._depContainer.bind(Types_1.Types.CIVILIAN_REPO, CivilianRepository_1.CivilianRepository);
        this._depContainer.bind(Types_1.Types.ROLE_REPO, RoleRepository_1.RoleRepository);
    }
    /**
     * @override
     */
    onStarting() {
        super.onStarting();
        // IMPORTANT - Default is `false`
        this._configProvider.enableRemote = false;
        this.attachAddOn(id_generator_1.registerIdAddOn());
        this.attachAddOn(persistence_1.registerDbAddOn());
        const webAddOn = web_1.registerWebAddOn();
        webAddOn.addGlobalErrorHandler(web_1.ErrorHandlerFilter);
        this.attachAddOn(webAddOn);
        // TODO: Should have registerAuthAddOn
        const authAddon = this._depContainer.resolve(oauth_1.Types.AUTH_ADDON);
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
//# sourceMappingURL=server.js.map