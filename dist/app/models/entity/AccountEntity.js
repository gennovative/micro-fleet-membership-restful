"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
class AccountEntity extends persistence_1.EntityBase {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.username = undefined;
        this.password = undefined;
        this.loginAttempts = undefined;
        this.lastAttemptAt = undefined;
        this.lastLoginAt = undefined;
        this.lastLoginFrom = undefined;
        this.unclockedAt = undefined;
        this.status = undefined;
        this.deletedAt = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
        this.roleId = undefined;
        this.refreshToken = undefined;
        this.tokenExp = undefined;
        // public civilianId: BigSInt = undefined;
    }
    static get relationMappings() {
        // Lazy reference to avoid circular reference.
        // `relationMappings()` is called only once for each connection.
        const { RoleEntity } = require('../entity/RoleEntity');
        return {
            belongtoRoles: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: RoleEntity,
                join: {
                    from: 'public.accounts.role_id',
                    to: 'public.account_roles.id'
                }
            }
        };
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.accounts';
    }
}
exports.AccountEntity = AccountEntity;
AccountEntity.translator = new common_1.ModelAutoMapper(AccountEntity);
//# sourceMappingURL=AccountEntity.js.map