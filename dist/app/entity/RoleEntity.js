"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const back_lib_persistence_1 = require("back-lib-persistence");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
class RoleEntity extends back_lib_persistence_1.EntityBase {
    constructor() {
        super(...arguments);
        this.name = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return RoleEntity.TABLE_NAME;
    }
}
RoleEntity.TABLE_NAME = 'public.account_roles';
exports.RoleEntity = RoleEntity;
RoleEntity.translator = new back_lib_common_contracts_1.ModelAutoMapper(RoleEntity);
