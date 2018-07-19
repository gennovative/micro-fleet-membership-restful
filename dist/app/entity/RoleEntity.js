"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
class RoleEntity extends persistence_1.EntityBase {
    constructor() {
        super(...arguments);
        this.name = undefined;
        this.deletedAt = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.account_roles';
    }
}
exports.RoleEntity = RoleEntity;
RoleEntity.translator = new common_1.ModelAutoMapper(RoleEntity);
//# sourceMappingURL=RoleEntity.js.map